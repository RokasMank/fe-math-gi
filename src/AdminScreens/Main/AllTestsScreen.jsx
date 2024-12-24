import React, { useEffect, useState } from "react";
import { Box, Heading, VStack, Button, Text, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../../apiClient";

const AllTestsScreen = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get("/Test"); // Fetch all tests
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleNavigateToTest = (id) => {
    navigate(`/admin/test/${id}`); // Navigate to the test details screen
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

  return (
    <Box padding={6}>
      <Heading size="lg" marginBottom={4}>
        All Tests
      </Heading>
      <VStack spacing={4}>
        {tests.map((test) => (
          <Box
            key={test.id}
            width="100%"
            padding={4}
            borderWidth={1}
            borderRadius="md"
            boxShadow="sm"
            _hover={{ boxShadow: "lg", cursor: "pointer" }}
            onClick={() => handleNavigateToTest(test.id)}
          >
            <Text fontSize="xl" fontWeight="bold">
              {test.title}
            </Text>
            <Text>{test.description}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default AllTestsScreen;
