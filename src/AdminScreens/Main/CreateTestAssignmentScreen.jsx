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
} from "@chakra-ui/react";
import api from "../../apiClient";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../../utils/useAppToast";

const CreateTestAssignmentScreen = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [assignmentId, setAssignmentId] = useState(null); // Store the created assignment ID
  const [studentCode, setStudentCode] = useState("");
  const [students, setStudents] = useState([]); // List of added students
  const toast = useAppToast();

  useEffect(() => {
    const fetchPublishedTests = async () => {
      try {
        const response = await api.get("/Test/published"); // Fetch only published tests
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
        toast("Klaida", "Nepavyko gauti testų.", "error");
      }
    };

    fetchPublishedTests();
  }, []);

  const handleCreateOrUpdateAssignment = async () => {
    if (!title.trim() || !selectedTest || !selectedClass) {
      toast("Klaida", "Prašome užpildyti visus privalomus laukus.", "error");
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

        toast("Sėkmė", "Priskyrimas sėkmingai atnaujintas.");
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

        toast(
          "Sėkmė",
          "Priskyrimas sėkmingai sukurtas. Dabar galite pridėti mokinius.",
        );
      }
    } catch (error) {
      console.error("Error creating/updating assignment:", error);
      toast("Klaida", "Nepavyko sukurti arba atnaujinti priskyrimo.", "error");
    }
  };

  const handleAddStudent = async () => {
    if (!studentCode.trim()) {
      toast("Klaida", "Mokinio kodas negali būti tuščias.", "error");
      return;
    }

    try {
      // Call the backend to add the student
      const response = await api.post(
        `/TestAssignment/${assignmentId}/add-student`,
        {
          studentCode,
        },
      );

      const { code, studentClass, gender } = response.data; // Extract student details

      // Check if the student is already in the local list
      if (students.some((student) => student.code === code)) {
        toast("Klaida", "Mokinys jau pridėtas.", "error");
        return;
      }

      // Add the student to the local list
      setStudents([...students, { code, studentClass, gender }]);
      setStudentCode(""); // Clear the input field

      toast("Sėkmė", "Mokinys pridėtas prie priskyrimo.");
    } catch (error) {
      console.error("Error adding student:", error);
      toast(
        "Klaida",
        "Nepavyko pridėti mokinio. Patikrinkite, ar kodas teisingas.",
        "error",
      );
    }
  };

  const handlePublishAssignment = async () => {
    try {
      await api.post(`/TestAssignment/${assignmentId}/publish`);
      toast("Sėkmė", "Priskyrimas sėkmingai paskelbtas.");
      navigate("/admin/landing");
    } catch (error) {
      console.error("Error publishing assignment:", error);
      toast("Klaida", "Nepavyko paskelbti priskyrimo.", "error");
    }
  };

  const handleRemoveStudent = async (studentCode) => {
    try {
      // Call the backend to remove the student
      await api.delete(
        `/TestAssignment/${assignmentId}/remove-student/${studentCode}`,
      );

      // Remove the student from the local list
      setStudents(students.filter((student) => student.code !== studentCode));

      toast("Sėkmė", `Mokinys ${studentCode} pašalintas iš priskyrimo.`);
    } catch (error) {
      console.error("Error removing student:", error);
      toast("Klaida", `Nepavyko pašalinti mokinio ${studentCode}.`, "error");
    }
  };

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={6}>
        {assignmentId ? "Atnaujinti priskyrimą" : "Sukurti priskyrimą"}
      </Heading>
      <VStack spacing={4} align="start">
        {/* Title */}
        <Box width="100%">
          <Heading size="sm">Priskyrimo pavadinimas:</Heading>
          <Input
            placeholder="Įveskite priskyrimo pavadinimą"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        {/* Description */}
        <Box width="100%">
          <Heading size="sm">Priskyrimo aprašymas:</Heading>
          <Textarea
            placeholder="Įveskite priskyrimo aprašymą"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        {/* Select Test */}
        <Box width="100%">
          <Heading size="sm">Pasirinkti testą:</Heading>
          <Select
            placeholder="Pasirinkite testą"
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
          <Heading size="sm">Pasirinkti klasę:</Heading>
          <Select
            placeholder="Pasirinkite klasę"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="1">1 klasė</option>
            <option value="2">2 klasė</option>
            <option value="3">3 klasė</option>
            <option value="4">4 klasė</option>
          </Select>
        </Box>

        {/* Create/Update Assignment Button */}
        <Button colorScheme="blue" onClick={handleCreateOrUpdateAssignment}>
          {assignmentId ? "Atnaujinti priskyrimą" : "Sukurti priskyrimą"}
        </Button>

        {/* Add Students Section */}
        {assignmentId && (
          <Box width="100%" marginTop={6}>
            <Heading size="md" marginBottom={4}>
              Pridėti mokinius prie priskyrimo
            </Heading>
            <HStack>
              <Input
                placeholder="Įveskite mokinio kodą"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
              />
              <Button colorScheme="teal" onClick={handleAddStudent}>
                Pridėti mokinį
              </Button>
            </HStack>
            {/* Display Added Students */}
            <VStack align="start" spacing={2} marginTop={4}>
              {students.map(({ code, studentClass, gender }, index) => (
                <HStack key={index} width="100%" justifyContent="space-between">
                  <Box>
                    <Text>- {code}</Text>
                    <Text>Klasė: {studentClass}</Text>
                    <Text>Lytis: {gender}</Text>
                  </Box>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveStudent(code)}
                  >
                    Pašalinti
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
                Paskelbti priskyrimą
              </Button>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CreateTestAssignmentScreen;
