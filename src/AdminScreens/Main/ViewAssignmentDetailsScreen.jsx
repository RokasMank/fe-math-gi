import React, { useEffect, useState } from "react";
import { Box, Heading, VStack, Text, HStack, Divider, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../apiClient";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { getStatusText, getStatusColor } from "../../utils/assignmentStatus";
import { useAppToast } from "../../utils/useAppToast";

const ViewAssignmentDetailsScreen = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useAppToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const response = await api.get(`/TestAssignment/${id}`);
        setAssignment(response.data);
      } catch (error) {
        console.error("Error fetching assignment details:", error);
        toast("Klaida", "Nepavyko gauti priskyrimo detalių.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetails();
  }, [id, toast]);

  const handleDeleteAssignment = async () => {
    const confirmDelete = window.confirm(
      "Ar tikrai norite ištrinti šį priskyrimą? Šio veiksmo negalima atšaukti."
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/TestAssignment/${id}`);
      toast("Sėkmė", "Priskyrimas sėkmingai ištrintas.");
      navigate("/admin/view-assignments");
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast("Klaida", "Nepavyko ištrinti priskyrimo. Įsitikinkite, kad jis nėra paskelbtas.", "error");
    }
  };

  const handlePublishAssignment = async () => {
    try {
      await api.post(`/TestAssignment/${id}/publish`);
      toast("Sėkmė", "Priskyrimas sėkmingai paskelbtas.");
      navigate(`/admin/view-assignments`);
    } catch (error) {
      console.error("Error publishing assignment:", error);
      toast("Klaida", "Nepavyko paskelbti priskyrimo.", "error");
    }
  };

  const handleUnpublishAssignment = async () => {
    try {
      await api.post(`/TestAssignment/${id}/unpublish`);
      toast("Sėkmė", "Priskyrimo skelbimas atšauktas.");
      navigate("/admin/view-assignments");
    } catch (error) {
      console.error("Error unpublishing assignment:", error);
      toast("Klaida", "Nepavyko atšaukti priskyrimo skelbimo.", "error");
    }
  };

  const handleFinishAssignment = async () => {
    const confirmFinish = window.confirm(
      "Ar tikrai norite baigti šį priskyrimą? Šio veiksmo negalima atšaukti."
    );

    if (!confirmFinish) return;

    try {
      await api.post(`/TestAssignment/${id}/finish`);
      toast("Sėkmė", "Priskyrimas sėkmingai pažymėtas kaip baigtas.");
      navigate(`/admin/view-assignments`);
    } catch (error) {
      console.error("Error finishing assignment:", error);
      toast("Klaida", "Nepavyko baigti priskyrimo.", "error");
    }
  };

  const handleDownloadResults = async () => {
    try {
      const response = await api.get(`/TestAssignment/${id}/download-results`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `assignment_${id}_results.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast("Sėkmė", "Rezultatai sėkmingai atsisiųsti.");
    } catch (error) {
      console.error("Error downloading results:", error);
      toast("Klaida", "Nepavyko atsisiųsti rezultatų.", "error");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!assignment) {
    return <Text>Priskyrimas nerastas.</Text>;
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
        Detalės
      </Heading>
      <VStack align="start" spacing={2}>
        <Text>Klasė: {assignment.class}</Text>
        <Text>
          Būsena:{" "}
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
        <Text>Testas: {assignment.test.title}</Text>
        <Text>Testo aprašymas: {assignment.test.description}</Text>
      </VStack>
      <Divider marginTop={6} marginBottom={4} />
      <Heading size="md" marginBottom={4}>
        Priskirti mokiniai
      </Heading>
      <VStack align="start" spacing={2}>
        {assignment.studentSessions.length > 0 ? (
          assignment.studentSessions.map((student, index) => (
            <Box key={index} borderWidth={1} borderRadius="md" padding={3}>
              <Text>Kodas: {student.code}</Text>
              <Text>Klasė: {student.studentClass}</Text>
              <Text>Lytis: {student.gender}</Text>
              <Text>
                Būsena:{" "}
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
                    ? "Juodraštis"
                    : student.sessionStatus === 1
                    ? "Vyksta"
                    : "Baigtas"}
                </Text>
              </Text>
            </Box>
          ))
        ) : (
          <Text>Šiam priskyrimui mokinių nėra.</Text>
        )}
      </VStack>

      <Divider marginTop={6} marginBottom={4} />
      <Button
        colorScheme="green"
        onClick={() => navigate(`/admin/test/${assignment.testId}`)}
      >
        Peržiūrėti testą
      </Button>

      <Divider marginTop={6} marginBottom={4} />
      <HStack spacing={4}>
        {assignment.testAssignmentStatus === 0 && (
          <>
            <Button colorScheme="green" onClick={handlePublishAssignment}>
              Paskelbti priskyrimą
            </Button>
            <Button colorScheme="red" onClick={handleDeleteAssignment}>
              Ištrinti priskyrimą
            </Button>
          </>
        )}
        {assignment.testAssignmentStatus === 1 && (
          <>
            <Button colorScheme="yellow" onClick={handleUnpublishAssignment}>
              Atšaukti skelbimą
            </Button>
            <Button colorScheme="blue" onClick={handleFinishAssignment}>
              Baigti priskyrimą
            </Button>
          </>
        )}
        <Button
          colorScheme="blue"
          onClick={() => navigate("/admin/view-assignments")}
        >
          Grįžti į priskyrimus
        </Button>
        <Button colorScheme="teal" onClick={handleDownloadResults}>
          Atsisiųsti rezultatus
        </Button>
      </HStack>
    </Box>
  );
};

export default ViewAssignmentDetailsScreen;
