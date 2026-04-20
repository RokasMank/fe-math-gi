import React, { useEffect, useState } from "react";
import { Box, Heading, VStack, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../../apiClient";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { useAppToast } from "../../utils/useAppToast";

const StudentMain = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useAppToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestSessions = async () => {
      try {
        // Make an API call to get student test sessions
        const response = await api.post(
          `/Student/getSessions/${localStorage.getItem("studentId")}`,
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching test sessions:", error);
        toast("Klaida", "Nepavyko gauti testo sesijų.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTestSessions();
  }, []);

  const handleStartSession = async (sessionId, testId) => {
    try {
      // Call the StartSession endpoint
      await api.put(`/TestSession/start/${sessionId}`);
      toast("Sesija pradėta", "Dabar galite pradėti testą.");
      // Navigate to the test page
      navigate(`/test/${sessionId}`, { state: { testId } });
    } catch (error) {
      console.error("Error starting test session:", error);
      toast("Klaida", "Nepavyko pradėti testo sesijos.", "error");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (sessions.length === 0) {
    return (
      <Box padding={6}>
        <Heading size="lg" marginBottom={4}>
          Nėra prieinamų testų
        </Heading>
        <Text>Šiuo metu jums nėra prieinamų testo sesijų.</Text>
      </Box>
    );
  }

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={6}>
        Sesijos
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
            <Text>Aprašymas: {session.test.description}</Text>
            <Text>Statusas: {session.sessionStatus}</Text>
            <Button
              colorScheme="blue"
              size="sm"
              marginTop={2}
              onClick={() => handleStartSession(session.id, session.test.id)}
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
