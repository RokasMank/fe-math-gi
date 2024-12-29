import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Spinner,
  Text,
  HStack,
  Divider,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../apiClient";

const ViewAssignmentDetailsScreen = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const response = await api.get(`/TestAssignment/${id}`);
        setAssignment(response.data);
      } catch (error) {
        console.error("Error fetching assignment details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch assignment details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetails();
  }, [id, toast]);

  const handleDeleteAssignment = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assignment? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/TestAssignment/${id}`);
      toast({
        title: "Success",
        description: "Assignment deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/view-assignments");
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast({
        title: "Error",
        description: "Failed to delete assignment. Ensure it is not published.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePublishAssignment = async () => {
    try {
      await api.post(`/TestAssignment/${id}/publish`);
      toast({
        title: "Success",
        description: "Assignment published successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/view-assignments");
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

  const handleUnpublishAssignment = async () => {
    try {
      await api.post(`/TestAssignment/${id}/unpublish`);
      toast({
        title: "Success",
        description: "Assignment unpublished successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/view-assignments");
    } catch (error) {
      console.error("Error unpublishing assignment:", error);
      toast({
        title: "Error",
        description: "Failed to unpublish assignment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!assignment) {
    return <Text>No assignment found.</Text>;
  }

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={6}>
        {assignment.title}
      </Heading>
      <Text fontSize="md" marginBottom={4}>
        {assignment.description}
      </Text>
      <Divider marginBottom={4} />
      <Heading size="md" marginBottom={4}>
        Details
      </Heading>
      <VStack align="start" spacing={2}>
        <Text>Class: {assignment.class}</Text>
        <Text>Status: {assignment.isPublished ? "Published" : "Draft"}</Text>
        <Text>Test: {assignment.test.title}</Text>
        <Text>Test Description: {assignment.test.description}</Text>
      </VStack>
      <Divider marginTop={6} marginBottom={4} />
      <Heading size="md" marginBottom={4}>
        Assigned Students
      </Heading>
      <VStack align="start" spacing={2}>
        {assignment.students.length > 0 ? (
          assignment.students.map((student, index) => (
            <Box key={index} borderWidth={1} borderRadius="md" padding={3}>
              <Text>Code: {student.code}</Text>
              <Text>Class: {student.studentClass}</Text>
              <Text>Gender: {student.gender}</Text>
            </Box>
          ))
        ) : (
          <Text>No students assigned to this assignment.</Text>
        )}
      </VStack>
      <Divider marginTop={6} marginBottom={4} />
      <Heading size="md" marginBottom={4}>
        Questions
      </Heading>
      <VStack align="start" spacing={2}>
        {assignment.test.questions.length > 0 ? (
          assignment.test.questions.map((question, index) => (
            <Box key={index} borderWidth={1} borderRadius="md" padding={3}>
              <Text fontWeight="bold">
                {index + 1}. {question.text}
              </Text>
              <Text>Points: {question.points}</Text>
              <Text>Type: {question.questionType}</Text>
              {question.options.length > 0 && (
                <>
                  <Text>Options:</Text>
                  <VStack align="start">
                    {question.options.map((option, optIndex) => (
                      <Text key={optIndex}>
                        - {option}{" "}
                        {question.correctAnswers.includes(option) && (
                          <Text as="span" color="green">
                            (Correct)
                          </Text>
                        )}
                      </Text>
                    ))}
                  </VStack>
                </>
              )}
            </Box>
          ))
        ) : (
          <Text>No questions available for this test.</Text>
        )}
      </VStack>
      <Divider marginTop={6} marginBottom={4} />
      <HStack spacing={4}>
        {!assignment.isPublished ? (
          <>
            <Button colorScheme="green" onClick={handlePublishAssignment}>
              Publish Assignment
            </Button>
            <Button colorScheme="red" onClick={handleDeleteAssignment}>
              Delete Assignment
            </Button>
          </>
        ) : (
          <Button colorScheme="yellow" onClick={handleUnpublishAssignment}>
            Unpublish Assignment
          </Button>
        )}
        <Button
          colorScheme="blue"
          onClick={() => navigate("/admin/view-assignments")}
        >
          Back to Assignments
        </Button>
      </HStack>
    </Box>
  );
};

export default ViewAssignmentDetailsScreen;
