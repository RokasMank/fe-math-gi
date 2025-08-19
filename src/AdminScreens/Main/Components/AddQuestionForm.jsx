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
          allowsEmptyAnswer: false,
          textWithBlanks: "", // Pridedame textWithBlanks
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

  // Funkcija, kuri skaičiuoja tuščių laukų skaičių tekste
  const countBlank = (text) => {
    return (text.match(/\[\[\]\]/g) || []).length;
  };

  // Funkcija, kuri valdo teisingų atsakymų įvestį FillInBlanks tipo klausimams
  const handleCorrectAnswerChange = (index, value) => {
    const updatedCorrectAnswers = [...question.correctAnswers];
    updatedCorrectAnswers[index] = value;
    setQuestion({
      ...question,
      correctAnswers: updatedCorrectAnswers,
    });
  };

  // Funkcija, kuri sinchronizuoja teisingų atsakymų masyvą su tuščių laukų skaičiumi
  const handleTextWithBlanksChange = (value) => {
    const blankCount = countBlank(value);
    const updatedCorrectAnswers = question.correctAnswers.slice(0, blankCount);
    while (updatedCorrectAnswers.length < blankCount) {
      updatedCorrectAnswers.push("");
    }
    setQuestion({
      ...question,
      textWithBlanks: value,
      correctAnswers: updatedCorrectAnswers,
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
      {/* <FormControl id="explanation">
        <FormLabel>Explanation (Optional)</FormLabel>
        <Textarea
          placeholder="Enter explanation for the question or correct answer"
          value={question.explanation || ""}
          onChange={(e) =>
            setQuestion({ ...question, explanation: e.target.value })
          }
        />
      </FormControl> */}
      <HStack spacing={4}>
        <FormControl isRequired id="points">
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
            onChange={(e) => {
              setQuestion({
                ...question,
                questionType: e.target.value,
                options: [],
                correctAnswers: [],
                textWithBlanks: "",
              });
            }}
          >
            <option value="MultipleChoice">Multiple Choice</option>
            <option value="SingleChoice">Single Choice</option>
            <option value="OpenEnded">Open Ended</option>
            <option value="FillInBlanks">Fill In Blank Spaces</option>
          </Select>
        </FormControl>
      </HStack>
      {question.questionType === "OpenEnded" && (
        <>
          <FormControl id="correctAnswers">
            <FormLabel>Correct Answer</FormLabel>
            <Textarea
              placeholder="Enter the correct answer"
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
          <FormControl display="flex" alignItems="center" marginTop={4}>
            <Checkbox
              isChecked={question.setMaxChars}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  setMaxChars: e.target.checked,
                  maxCharsAllowed: e.target.checked ? 1 : null,
                })
              }
            >
              Set Maximum Characters Limit
            </Checkbox>
          </FormControl>
          {question.setMaxChars && (
            <FormControl id="maxCharsAllowed" isRequired marginTop={2}>
              <FormLabel>
                Maximum Characters (think about punctuation too!! (,.))
              </FormLabel>
              <Input
                type="number"
                placeholder="Enter maximum characters (1-5000)"
                value={question.maxCharsAllowed || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value > 0 && value <= 5000) {
                    setQuestion({ ...question, maxCharsAllowed: value });
                  }
                }}
              />
            </FormControl>
          )}
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
                  onChange={() => {
                    if (question.questionType === "SingleChoice") {
                      setQuestion({
                        ...question,
                        correctAnswers: [option], // Tik vienas teisingas atsakymas
                      });
                    } else {
                      setQuestion({
                        ...question,
                        correctAnswers: question.correctAnswers.includes(option)
                          ? question.correctAnswers.filter(
                              (ans) => ans !== option
                            )
                          : [...question.correctAnswers, option],
                      });
                    }
                  }}
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
      {question.questionType === "FillInBlanks" && (
        <>
          <FormControl id="textWithBlanks" isRequired>
            <FormLabel>Text with Blank Spaces</FormLabel>
            <Textarea
              placeholder="Enter text with blanks (use [[]] for blanks, e.g., 'Sostinė yra [[]]. Šalis yra [[]].')"
              value={question.textWithBlanks || ""}
              onChange={(e) => handleTextWithBlanksChange(e.target.value)}
            />
          </FormControl>
          <FormControl id="correctAnswers">
            <FormLabel>Correct Answers for Blanks</FormLabel>
            <VStack spacing={2}>
              {question.correctAnswers.map((answer, index) => (
                <HStack key={index}>
                  <Input
                    placeholder={`Answer for blank ${index + 1}`}
                    value={answer}
                    onChange={(e) =>
                      handleCorrectAnswerChange(index, e.target.value)
                    }
                  />
                  <IconButton
                    aria-label="Remove answer"
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => {
                      const updatedAnswers = question.correctAnswers.filter(
                        (_, i) => i !== index
                      );
                      setQuestion({
                        ...question,
                        correctAnswers: updatedAnswers,
                      });
                    }}
                    isDisabled={
                      question.correctAnswers.length <=
                      countBlank(question.textWithBlanks)
                    }
                  />
                </HStack>
              ))}
            </VStack>
          </FormControl>
        </>
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
    setMaxChars: false,
    maxCharsAllowed: null,
    textWithBlanks: "",
  });

  const handleAddQuestion = async () => {
    // Papildoma validacija FillInBlanks tipo klausimams
    if (question.questionType === "FillInBlanks") {
      const countBlank = (text) => {
        return (text.match(/\[\[\]\]/g) || []).length;
      };
      const blankCount = countBlank(question.textWithBlanks);
      if (blankCount === 0) {
        toast({
          title: "Error Adding Question",
          description: "Text with blanks must contain at least one [[]].",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (
        question.correctAnswers.length !== blankCount ||
        question.correctAnswers.some((answer) => !answer.trim())
      ) {
        toast({
          title: "Error Adding Question",
          description:
            "Please provide a correct answer for each blank space ([[]]).",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

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
        setMaxChars: false,
        maxCharsAllowed: null,
        textWithBlanks: "",
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
