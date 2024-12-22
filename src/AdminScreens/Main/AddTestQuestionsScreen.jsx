import {
  Container,
  Card,
  Box,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import AddQuestionForm from "./Components/AddQuestionForm"; // Import the new component

function AddTestTestQuestionsScreen() {
  const toast = useToast();
  const location = useLocation();
  const { testId, title, description } = location.state || {}; // Retrieve testId, title, and description

  return (
    <Box>
      <VStack spacing={4}>
        <Heading size="lg" mb={4}>
          {title}
        </Heading>
        <Container>{description}</Container>
        <AddQuestionForm testId={testId} toast={toast} />
      </VStack>
    </Box>
  );
}

export default AddTestTestQuestionsScreen;
