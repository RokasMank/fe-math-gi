import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Textarea,
  Image,
} from "@chakra-ui/react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../apiClient";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { useAppToast } from "../../utils/useAppToast";

const StudentTestPage = () => {
  const { id } = useParams(); // Test session ID
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const toast = useAppToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { testId } = location.state || {};

  // Fetch test session
  useEffect(() => {
    const fetchTestSession = async () => {
      try {
        const response = await api.get(`/Test/${testId}`);
        setTest(response.data);
      } catch (error) {
        console.error("Error fetching test session:", error);
        toast("Klaida", "Nepavyko gauti testo sesijos.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTestSession();
  }, []);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          handleCompleteTest();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSubmit = async (isFinal) => {
    const question = test.questions[currentQuestionIndex];
    const answersToSubmit = extractAnswers(question);
    try {
      await api.put("/TestSession/submit-answer", {
        studentTestSessionId: id,
        answers: answersToSubmit,
      });
      toast("Atsakymas pateiktas", "Atsakymas pateiktas sėkmingai");
      if (isFinal) {
        handleCompleteTest();
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast("Klaida", "Nepavyko pateikti atsakymų.", "error");
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
    }
  };

  const handleCompleteTest = async () => {
    const confirmFinish = window.confirm("Ar tikrai norite baigti testą?");
    if (!confirmFinish) return;
    try {
      await api.post(`/TestSession/${id}/complete`);
      navigate("/main");
    } catch (error) {
      console.error("Error completing test:", error);
      toast("Klaida", "Nepavyko užbaigti testo.", "error");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!test) {
    return <Text>Testo sesija nerasta.</Text>;
  }

  const question = test.questions[currentQuestionIndex];

  const countBlanks = (text) => {
    return (text.match(/\[\[\]\]/g) || []).length;
  };

  const renderQuestion = (question) => {
    const blankCount =
      question.questionType === 4 ? countBlanks(question.textWithBlanks) : 0;

    return (
      <Box borderWidth={1} borderRadius="md" padding={4} marginBottom={6}>
        <Text fontWeight="bold" marginBottom={2} fontSize="14pt">
          {question.text}
        </Text>
        {question.imageUrl && (
          <Image src={question.imageUrl} marginBottom={4} />
        )}

        {!question.subQuestions?.length && (
          <>
            {/* MultipleChoice (questionType === 2) */}
            {question.questionType === 2 && question.options?.length > 0 && (
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

            {/* SingleChoice (questionType === 3) */}
            {question.questionType === 3 && question.options?.length > 0 && (
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

            {/* OpenEnded (questionType === 1) */}
            {question.questionType === 1 && (
              <Textarea
                maxLength={question.maxCharsAllowed}
                placeholder="Įrašykite atsakymą"
                value={selectedAnswers[question.id]?.[0] || ""}
                onChange={(e) =>
                  setSelectedAnswers((prev) => ({
                    ...prev,
                    [question.id]: [e.target.value],
                  }))
                }
              />
            )}

            {/* FillInBlanks (questionType === 4) */}
            {question.questionType === 4 && question.textWithBlanks && (
              <VStack align="start" spacing={4}>
                <Text>{question.textWithBlanks}</Text>
                {Array.from({ length: blankCount }).map((_, index) => (
                  <Textarea
                    key={index}
                    placeholder={`Atsakymas į ${index + 1} tuščią lauką`}
                    value={selectedAnswers[question.id]?.[index] || ""}
                    onChange={(e) =>
                      setSelectedAnswers((prev) => {
                        const updatedAnswers = [
                          ...(prev[question.id] || Array(blankCount).fill("")),
                        ];
                        updatedAnswers[index] = e.target.value;
                        return {
                          ...prev,
                          [question.id]: updatedAnswers,
                        };
                      })
                    }
                  />
                ))}
              </VStack>
            )}
          </>
        )}

        {/* Subquestions */}
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
  };

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={4}>
        {test.title}
      </Heading>
      <HStack justify="space-between" marginBottom={6}>
        <Text fontSize="md">
          Klausimas {currentQuestionIndex + 1} iš {test.questions.length}
        </Text>
        <Text fontSize="md" fontWeight="bold">
          Likęs laikas: {formatTime(timeLeft)}
        </Text>
      </HStack>
      {renderQuestion(question)}
      <HStack spacing={4}>
        <Button
          colorScheme="gray"
          onClick={handlePreviousQuestion}
          isDisabled={currentQuestionIndex === 0}
        >
          Ankstesnis
        </Button>
        <Button
          colorScheme="blue"
          onClick={() =>
            handleAnswerSubmit(
              currentQuestionIndex + 1 === test.questions.length,
            )
          }
          isDisabled={
            !selectedAnswers[question.id]?.some((ans) => ans.trim()) &&
            !question.subQuestions?.length &&
            (question.questionType !== 3 ||
              selectedAnswers[question.id]?.length ===
                countBlanks(question.textWithBlanks))
          }
        >
          {currentQuestionIndex + 1 < test.questions.length
            ? "Kitas"
            : "Baigti testą"}
        </Button>
      </HStack>
      <HStack spacing={2} marginTop={4}>
        {test.questions.map((_, index) => (
          <Button
            key={index}
            colorScheme={index === currentQuestionIndex ? "blue" : "gray"}
            size="sm"
            borderRadius={50}
            disabled
          >
            {index + 1}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default StudentTestPage;
