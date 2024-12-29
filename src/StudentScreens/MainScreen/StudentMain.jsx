import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Button,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../../apiClient";

const StudentMain = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestSessions = async () => {
      try {
        // Make an API call to get student test sessions
        const response = await api.post(
          `/Student/getSessions/${localStorage.getItem("studentId")}`
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching test sessions:", error);
        toast({
          title: "Error",
          description: "Failed to fetch test sessions.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestSessions();
  }, [toast, navigate]);

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

  if (sessions.length === 0) {
    return (
      <Box padding={6}>
        <Heading size="lg" marginBottom={4}>
          No Available Tests
        </Heading>
        <Text>No test sessions are currently available for you.</Text>
      </Box>
    );
  }

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={6}>
        Your Test Sessions
      </Heading>
      <VStack spacing={4} align="start">
        {sessions.map((session) => (
          <Box
            key={session.id}
            borderWidth={1}
            borderRadius="md"
            padding={4}
            width="100%"
          >
            <Text fontWeight="bold">{session.test.title}</Text>
            <Text>Description: {session.test.description}</Text>
            <Text>Status: {session.sessionStatus}</Text>
            <Button
              colorScheme="blue"
              size="sm"
              marginTop={2}
              onClick={() => navigate(`/test/${session.id}`)}
            >
              Pradėti testą
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default StudentMain;
