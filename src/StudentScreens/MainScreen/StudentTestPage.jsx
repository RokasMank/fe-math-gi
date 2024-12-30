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
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../apiClient";

const StudentTestPage = () => {
  const { id } = useParams(); // Test session ID
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { testId } = location.state || {};

  useEffect(() => {
    const fetchTestSession = async () => {
      try {
        const response = await api.get(`/Test/${testId}`);
        setTest(response.data);
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
  }, [testId, toast]);

  const handleAnswerSubmit = async (isFinal) => {
    const question = test.questions[currentQuestionIndex];
    const answersToSubmit = extractAnswers(question);

    try {
      await api.put("/TestSession/submit-answer", {
        studentTestSessionId: id,
        answers: answersToSubmit,
      });
      toast({
        title: "Answer Submitted",
        description: "Your answers have been saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (isFinal) {
        handleCompleteTest();
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedAnswers({});
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast({
        title: "Error",
        description: "Failed to submit your answers.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const extractAnswers = (question) => {
    let answers = [
      {
        questionId: question.id,
        providedAnswers: selectedAnswers[question.id] || [],
      },
    ];

    if (question.subQuestions && question.subQuestions.length > 0) {
      question.subQuestions.forEach((subQuestion) => {
        answers = answers.concat(extractAnswers(subQuestion));
      });
    }

    return answers;
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setSelectedAnswers({});
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
      navigate(`/results/${id}`);
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

  if (!test) {
    return <Text>No test session found.</Text>;
  }

  const question = test.questions[currentQuestionIndex];

  const renderQuestion = (question) => (
    <Box borderWidth={1} borderRadius="md" padding={4} marginBottom={6}>
      <Text fontWeight="bold" marginBottom={2}>
        {question.text}
      </Text>

      {/* Render input fields only if the question has correct answers and no subquestions */}
      {!question.subQuestions?.length && question.correctAnswers.length > 0 && (
        <>
          {question.questionType === 1 && (
            <CheckboxGroup
              value={selectedAnswers[question.id] || []}
              onChange={(values) =>
                setSelectedAnswers((prev) => ({
                  ...prev,
                  [question.id]: values,
                }))
              }
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
              value={selectedAnswers[question.id]?.[0] || ""}
              onChange={(value) =>
                setSelectedAnswers((prev) => ({
                  ...prev,
                  [question.id]: [value],
                }))
              }
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
              value={selectedAnswers[question.id]?.[0] || ""}
              onChange={(e) =>
                setSelectedAnswers((prev) => ({
                  ...prev,
                  [question.id]: [e.target.value],
                }))
              }
            />
          )}
        </>
      )}

      {/* Render subquestions recursively */}
      {question.subQuestions?.length > 0 && (
        <VStack align="start" marginTop={4}>
          {question.subQuestions.map((subQuestion, index) => (
            <Box key={index} marginTop={2}>
              {renderQuestion(subQuestion)}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={4}>
        {test.title}
      </Heading>
      <Text fontSize="md" marginBottom={6}>
        Question {currentQuestionIndex + 1} of {test.questions.length}
      </Text>
      {renderQuestion(question)}
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
              currentQuestionIndex + 1 === test.questions.length
            )
          }
          isDisabled={
            !selectedAnswers[question.id]?.length &&
            !question.subQuestions?.length &&
            question.correctAnswers.length > 0
          }
        >
          {currentQuestionIndex + 1 < test.questions.length
            ? "Next"
            : "Finish Test"}
        </Button>
      </HStack>
      <HStack spacing={2} marginTop={4}>
        {test.questions.map((_, index) => (
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
