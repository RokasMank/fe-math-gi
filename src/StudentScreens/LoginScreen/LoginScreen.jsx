import {
  Container,
  Card,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../apiClient";
import { useAppToast } from "../../utils/useAppToast";

function LoginScreen() {
  const [code, setCode] = useState(""); // State to capture the student code
  const navigate = useNavigate();
  const toast = useAppToast();

  const handleLogin = async () => {
    if (!code.trim()) {
      toast("Klaida", "Kodas negali būti tuščias.", "error");
      return;
    }

    try {
      // Call the backend login endpoint
      const response = await api.post(`Student/login/${code}`);
      const student = response.data;

      // Save id to localStorage
      localStorage.setItem("studentId", student.id);
      localStorage.setItem("studentCode", student.code);

      // Navigate to the main screen with student data if needed
      navigate("/main", { state: { student } });

      toast("Sėkmė", `Sveiki, ${student.code}`);
    } catch (error) {
      console.error("Error during login:", error);
      toast("Klaida", "Prisijungimas nepavyko. Patikrinkite savo kodą.", "error");
    }
  };

  return (
    <Container
      height={"100vh"}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Container>
        <Card>
          <CardBody>
            <VStack
              spacing={4}
              w="full"
              maxW="md"
              bg="white"
              p={6}
              borderRadius="md"
              boxShadow="lg"
            >
              <Heading size="lg" mb={4}>
                Prisijungimas
              </Heading>

              <FormControl id="code" isRequired>
                <FormLabel>Kodas</FormLabel>
                <Input
                  type="text"
                  placeholder="Įveskite kodą"
                  value={code}
                  onChange={(e) => setCode(e.target.value)} // Capture user input
                />
              </FormControl>

              <Button colorScheme="blue" w="full" onClick={handleLogin}>
                Prisijungti
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Container>
  );
}

export default LoginScreen;
