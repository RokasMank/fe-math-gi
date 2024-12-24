import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Select,
  Button,
  VStack,
  Input,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import api from "../../apiClient";

const CreateTestAssignmentScreen = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [assignmentId, setAssignmentId] = useState(null); // Store the created assignment ID
  const [studentCode, setStudentCode] = useState("");
  const [students, setStudents] = useState([]); // List of added students
  const toast = useToast();

  useEffect(() => {
    const fetchPublishedTests = async () => {
      try {
        const response = await api.get("/Test/published"); // Fetch only published tests
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
        toast({
          title: "Error",
          description: "Failed to fetch tests.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchPublishedTests();
  }, [toast]);

  const handleCreateAssignment = async () => {
    if (!selectedTest || !selectedClass) {
      toast({
        title: "Error",
        description: "Please select a test and a class.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await api.post("/TestAssignment/create", {
        testId: selectedTest,
        class: selectedClass,
      });

      const { assignmentId } = response.data;
      setAssignmentId(assignmentId); // Store assignment ID

      toast({
        title: "Success",
        description:
          "Assignment created successfully. You can now add students.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to create assignment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddStudent = async () => {
    if (!studentCode.trim()) {
      toast({
        title: "Error",
        description: "Student code cannot be empty.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Call the backend to add the student
      await api.post(`/TestAssignment/${assignmentId}/add-student`, {
        studentCode,
      });

      // Add the student to the local list
      setStudents([...students, studentCode]);
      setStudentCode(""); // Clear the input field

      toast({
        title: "Success",
        description: "Student added to the assignment.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student. Ensure the code is valid.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={6}>
        Create Assignment
      </Heading>
      <VStack spacing={4} align="start">
        {/* Select Test */}
        <Box width="100%">
          <Heading size="sm">Select Test:</Heading>
          <Select
            placeholder="Select a test"
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
          >
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.title}
              </option>
            ))}
          </Select>
        </Box>

        {/* Select Class */}
        <Box width="100%">
          <Heading size="sm">Select Class:</Heading>
          <Select
            placeholder="Select a class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
          </Select>
        </Box>

        {/* Create Assignment Button */}
        <Button colorScheme="blue" onClick={handleCreateAssignment}>
          Create Assignment
        </Button>

        {/* Add Students Section */}
        {assignmentId && (
          <Box width="100%" marginTop={6}>
            <Heading size="md" marginBottom={4}>
              Add Students to Assignment
            </Heading>
            <HStack>
              <Input
                placeholder="Enter student code"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
              />
              <Button colorScheme="teal" onClick={handleAddStudent}>
                Add Student
              </Button>
            </HStack>
            {/* Display Added Students */}
            <VStack align="start" spacing={2} marginTop={4}>
              {students.map((code, index) => (
                <Text key={index}>- {code}</Text>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CreateTestAssignmentScreen;
