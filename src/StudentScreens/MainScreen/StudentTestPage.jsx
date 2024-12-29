import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Spinner,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Textarea,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../apiClient";

const StudentTestPage = () => {
  const { id } = useParams(); // Test session ID
  const [testSession, setTestSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestSession = async () => {
      try {
        const response = await api.get(`/TestSession/${id}`);
        setTestSession(response.data);
      } catch (error) {
        console.error("Error fetching test session:", error);
        toast({
          title: "Error",
          description: "Failed to fetch test session.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestSession();
  }, [id, toast]);

  const handleAnswerSubmit = async (isFinal) => {
    const question = testSession.test.questions[currentQuestionIndex];
    const payload = {
      studentTestSessionId: testSession.id,
      questionId: question.id,
      providedAnswers: selectedAnswers,
    };

    try {
      await api.post("/TestSession/submit-answer", payload);
      toast({
        title: "Answer Submitted",
        description: "Your answer has been saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (isFinal) {
        handleCompleteTest();
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedAnswers([]);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Error",
        description: "Failed to submit your answer.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setSelectedAnswers([]); // Reset selected answers for the new question
    }
  };

  const handleCompleteTest = async () => {
    const confirmFinish = window.confirm(
      "Are you sure you want to finish the test? You will not be able to change your answers."
    );

    if (!confirmFinish) return;

    try {
      const response = await api.post(`/TestSession/${id}/complete`);
      toast({
        title: "Test Completed",
        description: `Your test is complete. Total score: ${response.data.totalScore}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate(`/results/${testSession.id}`);
    } catch (error) {
      console.error("Error completing test:", error);
      toast({
        title: "Error",
        description: "Failed to complete the test.",
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

  if (!testSession) {
    return <Text>No test session found.</Text>;
  }

  const question = testSession.test.questions[currentQuestionIndex];

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={4}>
        {testSession.test.title}
      </Heading>
      <Text fontSize="md" marginBottom={6}>
        Question {currentQuestionIndex + 1} of{" "}
        {testSession.test.questions.length}
      </Text>
      <Box borderWidth={1} borderRadius="md" padding={4} marginBottom={6}>
        <Text fontWeight="bold" marginBottom={2}>
          {question.text}
        </Text>
        {question.questionType === 1 && (
          <CheckboxGroup
            value={selectedAnswers}
            onChange={(values) => setSelectedAnswers(values)}
          >
            <VStack align="start">
              {question.options.map((option, index) => (
                <Checkbox key={index} value={option}>
                  {option}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        )}
        {question.questionType === 2 && (
          <RadioGroup
            value={selectedAnswers[0] || ""}
            onChange={(value) => setSelectedAnswers([value])}
          >
            <VStack align="start">
              {question.options.map((option, index) => (
                <Radio key={index} value={option}>
                  {option}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
        )}
        {question.questionType === 0 && (
          <Textarea
            placeholder="Type your answer here..."
            value={selectedAnswers[0] || ""}
            onChange={(e) => setSelectedAnswers([e.target.value])}
          />
        )}
      </Box>
      <HStack spacing={4}>
        <Button
          colorScheme="gray"
          onClick={handlePreviousQuestion}
          isDisabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          colorScheme="blue"
          onClick={() =>
            handleAnswerSubmit(
              currentQuestionIndex + 1 === testSession.test.questions.length
            )
          }
          isDisabled={selectedAnswers.length === 0}
        >
          {currentQuestionIndex + 1 < testSession.test.questions.length
            ? "Next"
            : "Finish Test"}
        </Button>
      </HStack>
      <HStack spacing={2} marginTop={4}>
        {testSession.test.questions.map((_, index) => (
          <Button
            key={index}
            colorScheme={index === currentQuestionIndex ? "blue" : "gray"}
            size="sm"
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default StudentTestPage;
