import React, { useEffect, useState } from "react";
import { Box, Heading, VStack, Text, Button, Divider } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import AddQuestionForm from "./Components/AddQuestionForm";
import QuestionView from "../../Common/QuestionView";
import LoadingSpinner from "../../Common/LoadingSpinner";
import api from "../../apiClient";
import { useAppToast } from "../../utils/useAppToast";

function AddTestTestQuestionsScreen() {
  const navigate = useNavigate();
  const { testId } = useParams(); // Get testId from URL
  const toast = useAppToast();
  const [testDetails, setTestDetails] = useState(null); // State for test details
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch test details, including existing questions
  const fetchTestDetails = async () => {
    try {
      const response = await api.get(`/Test/${testId}`); // Fetch test details
      setTestDetails(response.data);
    } catch (error) {
      console.error("Error fetching test details:", error);
      toast("Klaida", "Nepavyko gauti testo duomenų.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestDetails();
  }, [testId]);

  // Remove a question
  const handleRemoveQuestion = async (questionId) => {
    try {
      await api.delete(`/Question/${testId}/questions/${questionId}`); // Delete question
      setTestDetails({
        ...testDetails,
        questions: testDetails.questions.filter((q) => q.id !== questionId),
      });
      toast("Klausimas pašalintas", "Klausimas sėkmingai pašalintas.");
    } catch (error) {
      console.error("Error removing question:", error);
      toast("Klaida", "Nepavyko pašalinti klausimo.", "error");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!testDetails) {
    return <Text>Testo duomenų nerasta.</Text>;
  }

  return (
    <Box padding={6}>
      <VStack spacing={4} align="start">
        {/* Test Title and Description */}
        <Heading size="lg">{testDetails.title}</Heading>
        <Text>{testDetails.description}</Text>
        <Divider />
      </VStack>

      {/* Add Question Form */}
      <AddQuestionForm
        testId={testId}
        toast={toast}
        callback={fetchTestDetails}
      />

      {/* Display Existing Questions */}
      <Heading size="md" marginTop={6}>
        Esami klausimai
      </Heading>
      {testDetails.questions.length > 0 ? (
        <VStack align="start" spacing={4}>
          {testDetails.questions.map((question) => (
            <QuestionView
              key={question.id}
              question={question}
              onRemove={() => handleRemoveQuestion(question.id)}
            />
          ))}
        </VStack>
      ) : (
        <Text>Šiam testui dar nepridėta klausimų.</Text>
      )}
      <Button onClick={() => navigate("/admin/all-tests")}>Peržiūrėti testus</Button>
    </Box>
  );
}

export default AddTestTestQuestionsScreen;
