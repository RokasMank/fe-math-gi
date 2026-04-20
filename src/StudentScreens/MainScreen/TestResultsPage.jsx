import React, { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Divider } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import api from "../../apiClient";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { useAppToast } from "../../utils/useAppToast";

const TestResultsPage = ({ isTeacherView }) => {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useAppToast();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/TestSession/${id}/results`);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast("Klaida", "Nepavyko gauti rezultatų.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const renderQuestion = (result, index) => (
    <Box
      key={result.question.id}
      borderWidth={1}
      borderRadius="md"
      padding={4}
      width="100%"
      marginBottom={4}
    >
      <Text fontWeight="bold">
        {index + 1}. {result.question.text}
      </Text>
      {result.question.options?.length > 0 && (
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
        Pateikti atsakymai:{" "}
        {result.providedAnswers.length
          ? result.providedAnswers.join(", ")
          : "Atsakymas nepateiktas"}
      </Text>
      <Text>
        Teisingi atsakymai: {result.question.correctAnswers.join(", ")}
      </Text>
      <Text
        fontWeight="bold"
        color={result.isCorrect ? "green.500" : "red.500"}
      >
        {result.isCorrect ? "Teisingai" : "Neteisingai"}
      </Text>
      {result.subResults?.length > 0 && (
        <VStack align="start" marginTop={4}>
          {result.subResults.map((subResult, subIndex) =>
            renderQuestion(subResult, subIndex),
          )}
        </VStack>
      )}
    </Box>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!results) {
    return <Text>Rezultatų nerasta.</Text>;
  }

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={4}>
        {results.title}
      </Heading>
      <Text fontSize="md" marginBottom={6}>
        Taškai: {results.scoreEarned}/{results.totalScore}
      </Text>
      <Divider marginBottom={6} />
      <VStack spacing={6} align="start">
        {results.results.map((result, index) => renderQuestion(result, index))}
      </VStack>
    </Box>
  );
};

export default TestResultsPage;
