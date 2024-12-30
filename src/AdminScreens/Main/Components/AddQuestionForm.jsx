import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  HStack,
  VStack,
  IconButton,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import api from "../../../apiClient";

function QuestionForm({ question, setQuestion, removeSubQuestion }) {
  const handleAddOption = () => {
    setQuestion({
      ...question,
      options: [...question.options, ""],
    });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = question.options.filter((_, i) => i !== index);
    const updatedCorrectAnswers = question.correctAnswers.filter((answer) =>
      updatedOptions.includes(answer)
    );
    setQuestion({
      ...question,
      options: updatedOptions,
      correctAnswers: updatedCorrectAnswers,
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...question.options];
    updatedOptions[index] = value;
    setQuestion({
      ...question,
      options: updatedOptions,
    });
  };

  const handleAddSubQuestion = () => {
    setQuestion({
      ...question,
      subQuestions: [
        ...question.subQuestions,
        {
          text: "",
          points: "",
          questionType: "",
          options: [],
          correctAnswers: [],
          imageUrl: "",
          subQuestions: [],
          allowsEmptyAnswer: false, // New flag for Open Ended questions
        },
      ],
    });
  };

  const handleRemoveSubQuestion = (index) => {
    setQuestion({
      ...question,
      subQuestions: question.subQuestions.filter((_, i) => i !== index),
    });
  };

  const handleSubQuestionChange = (index, updatedSubQuestion) => {
    const updatedSubQuestions = [...question.subQuestions];
    updatedSubQuestions[index] = updatedSubQuestion;
    setQuestion({
      ...question,
      subQuestions: updatedSubQuestions,
    });
  };

  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      padding={4}
      width="100%"
      marginBottom={4}
    >
      <FormControl id="text" isRequired>
        <FormLabel>Question Text</FormLabel>
        <Textarea
          placeholder="Enter the question text"
          value={question.text}
          onChange={(e) => setQuestion({ ...question, text: e.target.value })}
        />
      </FormControl>
      <FormControl id="imageUrl">
        <FormLabel>Image URL</FormLabel>
        <Input
          placeholder="Enter image URL"
          value={question.imageUrl}
          onChange={(e) =>
            setQuestion({ ...question, imageUrl: e.target.value })
          }
        />
      </FormControl>
      <HStack spacing={4}>
        <FormControl id="points">
          <FormLabel>Points</FormLabel>
          <Input
            type="number"
            placeholder="Enter points"
            value={question.points}
            onChange={(e) =>
              setQuestion({ ...question, points: e.target.value })
            }
          />
        </FormControl>
        <FormControl id="questionType" isRequired>
          <FormLabel>Question Type</FormLabel>
          <Select
            placeholder="Select question type"
            value={question.questionType}
            onChange={(e) =>
              setQuestion({ ...question, questionType: e.target.value })
            }
          >
            <option value="MultipleChoice">Multiple Choice</option>
            <option value="SingleChoice">Single Choice</option>
            <option value="OpenEnded">Open Ended</option>
          </Select>
        </FormControl>
      </HStack>
      {question.questionType === "OpenEnded" && (
        <>
          <FormControl id="correctAnswers">
            <FormLabel>Correct Answer</FormLabel>
            <Textarea
              placeholder="Enter the correct answer (one per line)"
              value={question.correctAnswers.join("\n")}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  correctAnswers: e.target.value
                    .split("\n")
                    .map((line) => line.trim()),
                })
              }
            />
          </FormControl>
          <FormControl display="flex" alignItems="center" marginTop={4}>
            <Checkbox
              isChecked={question.allowsEmptyAnswer}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  allowsEmptyAnswer: e.target.checked,
                })
              }
            >
              Allow Empty Answer
            </Checkbox>
          </FormControl>
        </>
      )}
      {(question.questionType === "MultipleChoice" ||
        question.questionType === "SingleChoice") && (
        <FormControl id="options">
          <FormLabel>Options</FormLabel>
          <VStack spacing={2}>
            {question.options.map((option, index) => (
              <HStack key={index}>
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <Checkbox
                  isChecked={question.correctAnswers.includes(option)}
                  onChange={() =>
                    setQuestion({
                      ...question,
                      correctAnswers: question.correctAnswers.includes(option)
                        ? question.correctAnswers.filter(
                            (ans) => ans !== option
                          )
                        : [...question.correctAnswers, option],
                    })
                  }
                >
                  Mark as Correct
                </Checkbox>
                <IconButton
                  aria-label="Remove option"
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={() => handleRemoveOption(index)}
                />
              </HStack>
            ))}
            <Button
              leftIcon={<FaPlus />}
              onClick={handleAddOption}
              colorScheme="teal"
              size="sm"
            >
              Add Option
            </Button>
          </VStack>
        </FormControl>
      )}
      <VStack spacing={4} align="start" marginTop={4}>
        <FormLabel>Subquestions</FormLabel>
        {question.subQuestions.map((subQuestion, index) => (
          <Box key={index} borderWidth={1} borderRadius="md" padding={4}>
            <QuestionForm
              question={subQuestion}
              setQuestion={(updatedSubQuestion) =>
                handleSubQuestionChange(index, updatedSubQuestion)
              }
              removeSubQuestion={() => handleRemoveSubQuestion(index)}
            />
            <Button
              colorScheme="red"
              size="sm"
              marginTop={2}
              onClick={() => handleRemoveSubQuestion(index)}
            >
              Remove Subquestion
            </Button>
          </Box>
        ))}
        <Button
          leftIcon={<FaPlus />}
          onClick={handleAddSubQuestion}
          colorScheme="teal"
          size="sm"
        >
          Add Subquestion
        </Button>
      </VStack>
    </Box>
  );
}

function AddQuestionForm({ testId, toast, callback }) {
  const [question, setQuestion] = useState({
    text: "",
    points: "",
    questionType: "",
    options: [],
    correctAnswers: [],
    imageUrl: "",
    subQuestions: [],
  });

  const handleAddQuestion = async () => {
    try {
      await api.post(`/Question/${testId}/questions`, question);
      toast({
        title: "Question Added",
        description: "The question has been successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setQuestion({
        text: "",
        points: "",
        questionType: "",
        options: [],
        correctAnswers: [],
        imageUrl: "",
        subQuestions: [],
      });
      callback();
    } catch (error) {
      toast({
        title: "Error Adding Question",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <QuestionForm question={question} setQuestion={setQuestion} />
      <Button colorScheme="teal" onClick={handleAddQuestion}>
        Add Question
      </Button>
    </Box>
  );
}

export default AddQuestionForm;
