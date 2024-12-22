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

function AddQuestionForm({ testId, toast }) {
  const [text, setText] = useState("");
  const [points, setPoints] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const handleAddOption = () => {
    setOptions([...options, ""]); // Add a new empty option
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);

    // Ensure correctAnswers is a subset of updated options
    const updatedCorrectAnswers = correctAnswers.filter((answer) =>
      updatedOptions.includes(answer)
    );
    setCorrectAnswers(updatedCorrectAnswers);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value; // Update the value of the option at the given index
    setOptions(updatedOptions);
  };

  const toggleCorrectAnswer = (option) => {
    if (correctAnswers.includes(option)) {
      // If the option is already a correct answer, remove it
      setCorrectAnswers(correctAnswers.filter((answer) => answer !== option));
    } else {
      // Add the option to correctAnswers
      setCorrectAnswers([...correctAnswers, option]);
    }
  };

  const handleAddQuestion = async () => {
    if (correctAnswers.length > options.length) {
      toast({
        title: "Validation Error",
        description: "Correct answers cannot exceed total options.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const request = {
        text,
        points: parseInt(points),
        questionType: questionType,
        options,
        correctAnswers,
      };

      await api.post(`/Question/${testId}/questions`, request);
      toast({
        title: "Question Added.",
        description: "The question has been successfully added to the test.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Reset form fields
      setText("");
      setPoints("");
      setQuestionType("");
      setOptions([]);
      setCorrectAnswers([]);
    } catch (error) {
      toast({
        title: "Error Adding Question.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <FormControl id="text" isRequired>
        <FormLabel>Question Text</FormLabel>
        <Textarea
          width="100%"
          placeholder="Enter the question text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </FormControl>
      <HStack spacing={4} width="100%">
        <FormControl id="points" isRequired>
          <FormLabel>Points</FormLabel>
          <Input
            type="number"
            placeholder="Enter points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </FormControl>
        <FormControl id="questionType" isRequired>
          <FormLabel>Question Type</FormLabel>
          <Select
            placeholder="Select question type"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="MultipleChoice">Multiple Choice</option>
            <option value="SingleChoice">Single Choice</option>
            <option value="OpenEnded">Open Ended</option>
          </Select>
        </FormControl>
      </HStack>
      {(questionType === "MultipleChoice" ||
        questionType === "SingleChoice") && (
        <FormControl id="options" isRequired>
          <FormLabel>Options</FormLabel>
          <VStack spacing={2}>
            {options.map((option, index) => (
              <HStack key={index} width="100%">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <Checkbox
                  isChecked={correctAnswers.includes(option)}
                  onChange={() => toggleCorrectAnswer(option)}
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
      <Button marginTop={4} colorScheme="teal" onClick={handleAddQuestion}>
        Add Question
      </Button>
    </Box>
  );
}

export default AddQuestionForm;
