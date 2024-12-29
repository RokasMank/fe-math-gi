import React from "react";
import { Box, Button, Flex, Spacer, Text, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AppLayout = ({}) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // Assuming "role" is saved in localStorage

  console.log("bghjk");
  return (
    <Box>
      {/* Header */}
      <Flex as="header" padding={4} bg="gray.100" alignItems="center">
        <Text fontSize="lg" fontWeight="bold">
          Math4KTU
        </Text>
        <Spacer />
        {true && (
          <HStack spacing={6}>
            {/* Button to Navigate to Create Admin Screen */}
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate("/admin/create")}
            >
              Create Admin
            </Button>

            {/* Button to Navigate to Add Student Screen */}
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => navigate("/admin/add-student")}
            >
              Add Student
            </Button>

            {/* Button to Navigate to Create Test Screen */}
            <Button
              colorScheme="purple"
              size="lg"
              onClick={() => navigate("/admin/create-test")}
            >
              Create Test
            </Button>
            <Button
              colorScheme="green"
              size="lg"
              onClick={() => navigate("/admin/all-tests")}
            >
              All Tests
            </Button>
            <Button
              colorScheme="yellow"
              size="lg"
              onClick={() => navigate("/admin/create-assignment")}
            >
              Create test assignment
            </Button>
            <Button
              colorScheme="yellow"
              size="lg"
              onClick={() => navigate("/admin/view-assignments")}
            >
              View test assignments
            </Button>
          </HStack>
        )}
      </Flex>
      {/* Main Content */}
    </Box>
  );
};

export default AppLayout;
