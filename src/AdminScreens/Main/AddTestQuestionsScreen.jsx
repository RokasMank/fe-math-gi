import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Spinner,
  HStack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import AddQuestionForm from "./Components/AddQuestionForm"; // Import the AddQuestionForm component
import api from "../../apiClient"; // Import API client

function AddTestTestQuestionsScreen() {
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
          {testDetails.questions.map((question, index) => (
            <Box
              key={question.id}
              borderWidth={1}
              borderRadius="md"
              padding={4}
              width="100%"
            >
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="bold">
                    {index + 1}. {question.text}
                  </Text>
                  <Text>Points: {question.points}</Text>
                  {question.options?.length > 0 ? (
                    <Box marginTop={2}>
                      <Text fontWeight="bold">Options:</Text>
                      <VStack align="start">
                        {question.options.map((option, idx) => (
                          <HStack key={idx} spacing={2}>
                            <Text>- {option}</Text>
                            {question.correctAnswers.includes(option) && (
                              <Text
                                fontSize="sm"
                                color="green.500"
                                fontWeight="bold"
                              >
                                (Correct)
                              </Text>
                            )}
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  ) : (
                    <Box marginTop={2}>
                      <Text fontWeight="bold">Correct Answers:</Text>
                      <VStack align="start">
                        {question.correctAnswers.map((answer, idx) => (
                          <Text key={idx}>- {answer}</Text>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </Box>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleRemoveQuestion(question.id)}
                >
                  Remove
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No questions have been added to this test yet.</Text>
      )}
    </Box>
  );
}

export default AddTestTestQuestionsScreen;
