import { Container, VStack, Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function LandingScreen() {
  const navigate = useNavigate();

  return (
    <Container
      height={"100vh"}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing={6}>
        <Heading size="lg" mb={6}>
          Welcome to the System
        </Heading>

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
      </VStack>
    </Container>
  );
}

export default LandingScreen;
