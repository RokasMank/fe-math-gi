import {
  Container,
  Card,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../../apiClient";

function CreateTestScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();

  const handleCreateTest = async () => {
    try {
      await api.post("/tests", { title, description });
      toast({
        title: "Test Created.",
        description: "The test has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTitle("");
      setDescription("");
    } catch (error) {
      toast({
        title: "Error Creating Test.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card>
        <CardBody>
          <VStack spacing={4} maxW="md">
            <Heading size="lg" mb={4}>
              Create Test
            </Heading>
            <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                placeholder="Enter test title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Enter test description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="purple" onClick={handleCreateTest}>
              Create Test
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default CreateTestScreen;
