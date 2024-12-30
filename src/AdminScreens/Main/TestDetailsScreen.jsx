import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Divider,
  Button,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../apiClient";
import QuestionView from "../../Common/QuestionView";

const TestDetailsScreen = () => {
  const { id } = useParams(); // Get test ID from route params
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch test details
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await api.get(`/Test/${id}`);
        setTest(response.data);
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

  // Publish the test
  const handlePublishTest = async () => {
    try {
      await api.post(`/Test/${id}/publish`);
      setTest({ ...test, published: true }); // Update the state to reflect the test is now published
      toast({
        title: "Test Published",
        description: "The test was successfully published.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error publishing test:", error);
      toast({
        title: "Error",
        description: "Failed to publish the test.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGoToTest = () => {
    navigate(`/admin/create-test/add-questions/${id}`);
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

  if (!test) {
    return <Text>No test found.</Text>;
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
        {test.published ? "Status: Published" : "Status: Draft (Not Published)"}
      </Text>

      {!test.published && (
        <>
          <Button
            colorScheme="teal"
            marginBottom={6}
            onClick={handlePublishTest}
          >
            Publish Test
          </Button>

          <Button
            colorScheme="yellow"
            marginBottom={6}
            onClick={handleGoToTest}
          >
            Go to test
          </Button>
        </>
      )}

      <Divider marginBottom={4} />
      <Heading size="md" marginBottom={4}>
        Questions
      </Heading>
      <VStack align="start" spacing={4}>
        {test.questions.length > 0 ? (
          test.questions.map((question, index) => (
            // <Box
            //   key={question.id}
            //   borderWidth={1}
            //   borderRadius="md"
            //   padding={4}
            //   width="100%"
            // >
            //   <HStack justify="space-between">
            //     <Box>
            //       <Text fontWeight="bold">
            //         {index + 1}. {question.text}
            //       </Text>
            //       <Text>Points: {question.points}</Text>
            //       {question.options?.length > 0 ? (
            //         <Box marginTop={2}>
            //           <Text fontWeight="bold">Options:</Text>
            //           <VStack align="start">
            //             {question.options.map((option, idx) => (
            //               <HStack key={idx} spacing={2}>
            //                 <Text>- {option}</Text>
            //                 {question.correctAnswers.includes(option) && (
            //                   <Text
            //                     fontSize="sm"
            //                     color="green.500"
            //                     fontWeight="bold"
            //                   >
            //                     (Correct)
            //                   </Text>
            //                 )}
            //               </HStack>
            //             ))}
            //           </VStack>
            //         </Box>
            //       ) : (
            //         <Box marginTop={2}>
            //           <Text fontWeight="bold">Correct Answers:</Text>
            //           <VStack align="start">
            //             {question.correctAnswers.map((answer, idx) => (
            //               <Text key={idx}>- {answer}</Text>
            //             ))}
            //           </VStack>
            //         </Box>
            //       )}
            //     </Box>
            //     {!test.published && (
            //       <Button
            //         colorScheme="red"
            //         size="sm"
            //         onClick={() => handleRemoveQuestion(question.id)}
            //       >
            //         Remove
            //       </Button>
            //     )}
            //   </HStack>
            // </Box>
            <QuestionView question={question} />
          ))
        ) : (
          <Text>No questions available for this test.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default TestDetailsScreen;
