import React, { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Divider, Button, HStack } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../apiClient";
import QuestionView from "../../Common/QuestionView";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { useAppToast } from "../../utils/useAppToast";

const TestDetailsScreen = () => {
  const { id } = useParams(); // Get test ID from route params
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useAppToast();
  const navigate = useNavigate();

  // Fetch test details
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await api.get(`/Test/${id}`);
        setTest(response.data);
      } catch (error) {
        console.error("Error fetching test details:", error);
        toast("Klaida", "Nepavyko gauti testo duomenų.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id, toast]);

  // Remove a question
  const handleRemoveQuestion = async (questionId) => {
    try {
      await api.delete(`/Test/${id}/questions/${questionId}`);
      setTest({
        ...test,
        questions: test.questions.filter((q) => q.id !== questionId),
      });
      toast("Klausimas pašalintas", "Klausimas sėkmingai pašalintas.");
    } catch (error) {
      console.error("Error removing question:", error);
      toast("Klaida", "Nepavyko pašalinti klausimo.", "error");
    }
  };

  // Publish the test
  const handlePublishTest = async () => {
    try {
      await api.post(`/Test/${id}/publish`);
      setTest({ ...test, published: true }); // Update the state to reflect the test is now published
      toast("Testas paskelbtas", "Testas sėkmingai paskelbtas.");
    } catch (error) {
      console.error("Error publishing test:", error);
      toast("Klaida", "Nepavyko paskelbti testo.", "error");
    }
  };

  const handleGoToTest = () => {
    navigate(`/admin/create-test/add-questions/${id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!test) {
    return <Text>Testas nerastas.</Text>;
  }

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={4}>
        {test.title}
      </Heading>
      <Text fontSize="md" marginBottom={6}>
        {test.description}
      </Text>
      <Text fontSize="sm" marginBottom={6}>
        {test.published ? "Būsena: Paskelbtas" : "Būsena: Juodraštis (nepaskelbtas)"}
      </Text>

      {!test.published && (
        <>
          <Button
            colorScheme="teal"
            marginBottom={6}
            onClick={handlePublishTest}
          >
            Paskelbti testą
          </Button>

          <Button
            colorScheme="yellow"
            marginBottom={6}
            onClick={handleGoToTest}
          >
            Eiti į testą
          </Button>
        </>
      )}

      <Divider marginBottom={4} />
      <Heading size="md" marginBottom={4}>
        Klausimai
      </Heading>
      <VStack align="start" spacing={4}>
        {test.questions.length > 0 ? (
          test.questions.map((question, index) => (
            <QuestionView key={question.id} question={question} />
          ))
        ) : (
          <Text>Šiam testui klausimų nėra.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default TestDetailsScreen;
