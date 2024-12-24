import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Select,
  Button,
  VStack,
  Input,
  Textarea,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import api from "../../apiClient";

const CreateTestAssignmentScreen = () => {
  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  const handleCreateOrUpdateAssignment = async () => {
    if (!title.trim() || !selectedTest || !selectedClass) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      let response;
      if (assignmentId) {
        // Update assignment
        response = await api.put(`/TestAssignment/update/${assignmentId}`, {
          testId: selectedTest,
          class: selectedClass,
          title,
          description,
        });

        toast({
          title: "Success",
          description: "Assignment updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Create assignment
        response = await api.post("/TestAssignment/create", {
          testId: selectedTest,
          class: selectedClass,
          title,
          description,
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
      }
    } catch (error) {
      console.error("Error creating/updating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to create or update assignment.",
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
      const response = await api.post(
        `/TestAssignment/${assignmentId}/add-student`,
        {
          studentCode,
        }
      );

      const { code, studentClass, gender } = response.data; // Extract student details

      // Check if the student is already in the local list
      if (students.some((student) => student.code === code)) {
        toast({
          title: "Error",
          description: "Student is already added.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Add the student to the local list
      setStudents([...students, { code, studentClass, gender }]);
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

  const handlePublishAssignment = async () => {
    try {
      await api.post(`/TestAssignment/${assignmentId}/publish`);
      toast({
        title: "Success",
        description: "Assignment published successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error publishing assignment:", error);
      toast({
        title: "Error",
        description: "Failed to publish assignment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemoveStudent = async (studentCode) => {
    try {
      // Call the backend to remove the student
      await api.delete(
        `/TestAssignment/${assignmentId}/remove-student/${studentCode}`
      );

      // Remove the student from the local list
      setStudents(students.filter((student) => student.code !== studentCode));

      toast({
        title: "Success",
        description: `Student ${studentCode} removed from the assignment.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error removing student:", error);
      toast({
        title: "Error",
        description: `Failed to remove student ${studentCode}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={6}>
        {assignmentId ? "Update Assignment" : "Create Assignment"}
      </Heading>
      <VStack spacing={4} align="start">
        {/* Title */}
        <Box width="100%">
          <Heading size="sm">Assignment Title:</Heading>
          <Input
            placeholder="Enter assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        {/* Description */}
        <Box width="100%">
          <Heading size="sm">Assignment Description:</Heading>
          <Textarea
            placeholder="Enter assignment description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

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

        {/* Create/Update Assignment Button */}
        <Button colorScheme="blue" onClick={handleCreateOrUpdateAssignment}>
          {assignmentId ? "Update Assignment" : "Create Assignment"}
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
              {students.map(({ code, studentClass, gender }, index) => (
                <HStack key={index} width="100%" justifyContent="space-between">
                  <Box>
                    <Text>- {code}</Text>
                    <Text>Class: {studentClass}</Text>
                    <Text>Gender: {gender}</Text>
                  </Box>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveStudent(code)}
                  >
                    Remove
                  </Button>
                </HStack>
              ))}
            </VStack>

            {/* Publish Assignment Button */}
            {students.length > 0 && (
              <Button
                colorScheme="green"
                marginTop={4}
                onClick={handlePublishAssignment}
              >
                Publish Assignment
              </Button>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CreateTestAssignmentScreen;
