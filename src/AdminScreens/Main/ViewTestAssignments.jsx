import React, { useEffect, useState } from "react";
import { Box, Heading, VStack, Button, Text, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../../apiClient";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { getStatusText, getStatusColor } from "../../utils/assignmentStatus";
import { useAppToast } from "../../utils/useAppToast";

const ViewTestAssignmentsScreen = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useAppToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get("/TestAssignment"); // Fetch all assignments
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        toast("Klaida", "Nepavyko gauti testo priskyrimų.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (assignments.length === 0) {
    return <Text>Priskyrimų nerasta.</Text>;
  }

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={6}>
        Testo priskyrimai
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
                <Text>Aprašymas: {assignment.description}</Text>
                <Text>Klasė: {assignment.class}</Text>
                <Text>
                  Būsena:{" "}
                  <Text
                    as="span"
                    fontWeight="bold"
                    color={getStatusColor(assignment.testAssignmentStatus)}
                  >
                    {getStatusText(assignment.testAssignmentStatus)}
                  </Text>
                </Text>
              </Box>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() =>
                  navigate(`/admin/view-assignment/${assignment.id}`)
                }
              >
                Peržiūrėti
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ViewTestAssignmentsScreen;
