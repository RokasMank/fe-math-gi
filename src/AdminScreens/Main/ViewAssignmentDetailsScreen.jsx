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
      navigate(`/admin/view-assignments`);
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

  const handleFinishAssignment = async () => {
    const confirmFinish = window.confirm(
      "Are you sure you want to finish this assignment? This action is irreversible."
    );

    if (!confirmFinish) return;

    try {
      await api.post(`/TestAssignment/${id}/finish`);
      toast({
        title: "Success",
        description: "Assignment marked as finished successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate(`/admin/view-assignments`);
    } catch (error) {
      console.error("Error finishing assignment:", error);
      toast({
        title: "Error",
        description: "Failed to finish assignment.",
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

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "gray.400";
      case 1:
        return "yellow.400";
      case 2:
        return "green.400";
      default:
        return "gray.400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Draft";
      case 1:
        return "Published";
      case 2:
        return "Finished";
      default:
        return "NA";
    }
  };

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
        <Text>
          Status:{" "}
          <Text
            as="span"
            fontWeight="bold"
            paddingX={2}
            paddingY={1}
            borderRadius="md"
            backgroundColor={getStatusColor(assignment.testAssignmentStatus)}
            color="white"
          >
            {getStatusText(assignment.testAssignmentStatus)}
          </Text>
        </Text>
        <Text>Test: {assignment.test.title}</Text>
        <Text>Test Description: {assignment.test.description}</Text>
      </VStack>
      <Divider marginTop={6} marginBottom={4} />
      <Heading size="md" marginBottom={4}>
        Assigned Students
      </Heading>
      <VStack align="start" spacing={2}>
        {assignment.studentSessions.length > 0 ? (
          assignment.studentSessions.map((student, index) => (
            <Box key={index} borderWidth={1} borderRadius="md" padding={3}>
              <Text>Code: {student.code}</Text>
              <Text>Class: {student.studentClass}</Text>
              <Text>Gender: {student.gender}</Text>
              <Text>
                Status:{" "}
                <Text
                  as="span"
                  fontWeight="bold"
                  color={
                    student.sessionStatus === 0
                      ? "gray.400"
                      : student.sessionStatus === 1
                      ? "yellow.400"
                      : "green.400"
                  }
                >
                  {student.sessionStatus === 0
                    ? "Draft"
                    : student.sessionStatus === 1
                    ? "In Progress"
                    : "Finished"}
                </Text>
              </Text>
            </Box>
          ))
        ) : (
          <Text>No students assigned to this assignment.</Text>
        )}
      </VStack>

      <Divider marginTop={6} marginBottom={4} />
      <Button
        colorScheme="green"
        onClick={() => navigate(`/admin/test/${assignment.testId}`)}
      >
        View test
      </Button>

      <Divider marginTop={6} marginBottom={4} />
      <HStack spacing={4}>
        {assignment.testAssignmentStatus === 0 && (
          <>
            <Button colorScheme="green" onClick={handlePublishAssignment}>
              Publish Assignment
            </Button>
            <Button colorScheme="red" onClick={handleDeleteAssignment}>
              Delete Assignment
            </Button>
          </>
        )}
        {assignment.testAssignmentStatus === 1 && (
          <>
            <Button colorScheme="yellow" onClick={handleUnpublishAssignment}>
              Unpublish Assignment
            </Button>
            <Button colorScheme="blue" onClick={handleFinishAssignment}>
              Finish Assignment
            </Button>
          </>
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
