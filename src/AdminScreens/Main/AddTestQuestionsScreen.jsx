import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Spinner,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import AddQuestionForm from "./Components/AddQuestionForm";
import QuestionView from "../../Common/QuestionView";
import api from "../../apiClient";

function AddTestTestQuestionsScreen() {
  const navigate = useNavigate();
  const { testId } = useParams(); // Get testId from URL
  const toast = useToast();
  const [testDetails, setTestDetails] = useState(null); // State for test details
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch test details, including existing questions
  const fetchTestDetails = async () => {
    try {
      const response = await api.get(`/Test/${testId}`); // Fetch test details
      setTestDetails(response.data);
    } catch (error) {
      console.error("Error fetching test details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch test details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
      toast({
        title: "Question Removed",
        description: "The question was successfully removed.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error removing question:", error);
      toast({
        title: "Error",
        description: "Failed to remove the question.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!testDetails) {
    return <Text>No test details found.</Text>;
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
        Existing Questions
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
        <Text>No questions have been added to this test yet.</Text>
      )}
      <Button onClick={() => navigate("/admin/all-tests")}>View tests</Button>
    </Box>
  );
}

export default AddTestTestQuestionsScreen;
