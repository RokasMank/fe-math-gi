import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import api from "../../apiClient";

const TestResultsPage = ({ isTeacherView }) => {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/TestSession/${id}/results`);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast({
          title: "Error",
          description: "Failed to fetch results.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, toast]);

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

  if (!results) {
    return <Text>No results found.</Text>;
  }

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={4}>
        {results.title}
      </Heading>
      <Text fontSize="md" marginBottom={6}>
        Score: {results.score}
      </Text>
      <Divider marginBottom={6} />
      <VStack spacing={6} align="start">
        {results.results.map((result, index) => (
          <Box
            key={result.question.id}
            borderWidth={1}
            borderRadius="md"
            padding={4}
            width="100%"
          >
            <Text fontWeight="bold">
              {index + 1}. {result.question.text}
            </Text>
            {result.question.options && (
              <VStack align="start" marginTop={2}>
                {result.question.options.map((option, idx) => (
                  <Text
                    key={idx}
                    color={
                      result.question.correctAnswers.includes(option)
                        ? "green.500"
                        : result.providedAnswers.includes(option)
                        ? "red.500"
                        : "gray.800"
                    }
                  >
                    - {option}
                  </Text>
                ))}
              </VStack>
            )}
            <Text marginTop={2}>
              Provided Answers:{" "}
              {result.providedAnswers.length
                ? result.providedAnswers.join(", ")
                : "No answer provided"}
            </Text>
            <Text>
              Correct Answers: {result.question.correctAnswers.join(", ")}
            </Text>
            <Text
              fontWeight="bold"
              color={result.isCorrect ? "green.500" : "red.500"}
            >
              {result.isCorrect ? "Correct" : "Incorrect"}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TestResultsPage;
