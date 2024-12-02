import {
  Container,
  Card,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../../apiClient";

function AddStudentScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleAddStudent = async () => {
    try {
      await api.post("/students", { name, email });
      toast({
        title: "Student Added.",
        description: "The student has been successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setName("");
      setEmail("");
    } catch (error) {
      toast({
        title: "Error Adding Student.",
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
              Add Student
            </Heading>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="teal" onClick={handleAddStudent}>
              Add Student
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default AddStudentScreen;
