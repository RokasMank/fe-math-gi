import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Spinner,
  Button,
  Text,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../../apiClient";

const ViewTestAssignmentsScreen = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get("/TestAssignment"); // Fetch all assignments
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        toast({
          title: "Error",
          description: "Failed to fetch test assignments.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [toast]);

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

  if (assignments.length === 0) {
    return <Text>No assignments found.</Text>;
  }

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={6}>
        Test Assignments
      </Heading>
      <VStack spacing={4} align="start">
        {assignments.map((assignment) => (
          <Box
            key={assignment.id}
            borderWidth={1}
            borderRadius="md"
            padding={4}
            width="100%"
          >
            <HStack justifyContent="space-between">
              <Box>
                <Text fontWeight="bold">{assignment.title}</Text>
                <Text>Description: {assignment.description}</Text>
                <Text>Class: {assignment.class}</Text>
                <Text>
                  Status: {assignment.isPublished ? "Published" : "Draft"}
                </Text>
              </Box>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() =>
                  navigate(`/admin/view-assignment/${assignment.id}`)
                }
              >
                View Details
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ViewTestAssignmentsScreen;
