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
          Sveiki atvykę į sistemą
        </Heading>

        {/* Button to Navigate to Create Admin Screen */}
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => navigate("/admin/create")}
        >
          Sukurti administratorių
        </Button>

        {/* Button to Navigate to Add Student Screen */}
        <Button
          colorScheme="teal"
          size="lg"
          onClick={() => navigate("/admin/manage-students")}
        >
          Tvarkyti mokinius
        </Button>

        {/* Button to Navigate to Create Test Screen */}
        <Button
          colorScheme="purple"
          size="lg"
          onClick={() => navigate("/admin/create-test")}
        >
          Sukurti testą
        </Button>
        <Button
          colorScheme="green"
          size="lg"
          onClick={() => navigate("/admin/all-tests")}
        >
          Visi testai
        </Button>
        <Button
          colorScheme="yellow"
          size="lg"
          onClick={() => navigate("/admin/create-assignment")}
        >
          Sukurti testo priskyrimą
        </Button>
        <Button
          colorScheme="yellow"
          size="lg"
          onClick={() => navigate("/admin/view-assignments")}
        >
          Peržiūrėti testo priskyrimus
        </Button>
      </VStack>
    </Container>
  );
}

export default LandingScreen;
