import React from "react";
import { Box, Text, VStack, HStack, Image, Button } from "@chakra-ui/react";

function QuestionView({ question, onRemove }) {
  return (
    <Box borderWidth={1} borderRadius="md" padding={4} width="100%">
      <HStack justify="space-between">
        <Box>
          {/* Question Text */}
          <Text fontWeight="bold">{question.text}</Text>
          <Text>Points: {question.points}</Text>

          {/* Display Image if available */}
          {question.imageUrl && (
            <Box marginY={4}>
              <Image src={question.imageUrl} />
            </Box>
          )}

          {/* Display Options */}
          {question.options?.length > 0 && (
            <Box marginTop={2}>
              <Text fontWeight="bold">Options:</Text>
              <VStack align="start">
                {question.options.map((option, idx) => (
                  <HStack key={idx} spacing={2}>
                    <Text>- {option}</Text>
                    {question.correctAnswers.includes(option) && (
                      <Text fontSize="sm" color="green.500" fontWeight="bold">
                        (Correct)
                      </Text>
                    )}
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}

          {/* Display Correct Answers for Open-Ended Questions */}
          {!question.options?.length && question.correctAnswers.length > 0 && (
            <Box marginTop={2}>
              <Text fontWeight="bold">Correct Answers:</Text>
              <VStack align="start">
                {question.correctAnswers.map((answer, idx) => (
                  <Text key={idx}>- {answer}</Text>
                ))}
              </VStack>
            </Box>
          )}
          {question.questionType === 4 && (
            <Box marginTop={2}>
              <Text fontWeight="bold">Text with Blanks:</Text>
              <Text>{question.textWithBlanks}</Text>
            </Box>
          )}
          {question.maxCharsAllowed ? (
            <Box marginTop={2}>
              <Text fontWeight="bold">Maximum answer characters</Text>

              <Text>{question.maxCharsAllowed}</Text>
            </Box>
          ) : null}
          {/* Display Subquestions */}
          {question.subQuestions?.length > 0 && (
            <Box marginTop={4}>
              <Text fontWeight="bold">Subquestions:</Text>
              <VStack align="start" spacing={4}>
                {question.subQuestions.map((subQuestion) => (
                  <QuestionView
                    key={subQuestion.id}
                    question={subQuestion}
                    onRemove={onRemove && (() => onRemove(subQuestion.id))}
                  />
                ))}
              </VStack>
            </Box>
          )}
        </Box>

        {/* Remove Button */}
        {onRemove && (
          <Button colorScheme="red" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
      </HStack>
    </Box>
  );
}

export default QuestionView;
