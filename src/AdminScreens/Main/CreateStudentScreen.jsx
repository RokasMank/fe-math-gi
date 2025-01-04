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
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../../apiClient";

function CreateStudentScreen() {
  const [code, setCode] = useState("");
  const [gender, setGender] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [school, setSchool] = useState("");
  const toast = useToast();

  const handleAddStudent = async () => {
    if (!studentClass) {
      toast({
        title: "Invalid Class.",
        description: "Class must not be empty.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await api.post("/Student/create", {
        code,
        gender,
        class: studentClass,
        school,
      });
      toast({
        title: "Student Added.",
        description: "The student has been successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setCode("");
      setGender("");
      setStudentClass("");
      setSchool("");
    } catch (error) {
      if (error.status === 409) {
        toast({
          title: "Error Adding Student.",
          description: "Student with this code already exists.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error Adding Student.",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
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
            <FormControl id="code" isRequired>
              <FormLabel>Code</FormLabel>
              <Input
                type="text"
                placeholder="Enter student code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </FormControl>
            <FormControl id="gender" isRequired>
              <FormLabel>Gender</FormLabel>
              <Select
                placeholder="Select gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FormControl>
            <FormControl id="class" isRequired>
              <FormLabel>Class</FormLabel>
              <Input
                type="text"
                placeholder="Enter class (e.g., 10A, 11B)"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              />
            </FormControl>
            <FormControl id="school" isRequired>
              <FormLabel>School</FormLabel>
              <Input
                type="text"
                placeholder="Enter school name"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
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

export default CreateStudentScreen;
