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
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../apiClient";

function AdminLoginScreen() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // Send POST request to the login endpoint
      const response = await api.post("/Admin/login", {
        username: userName,
        password,
      });

      // Extract the token from the response
      console.log(response);
      const token = response.data;

      // Save token to localStorage
      localStorage.setItem("token", token);
      console.log(localStorage.getItem("token"));
      // Navigate to the main admin page
      navigate("/admin/landing");
    } catch (err) {
      // Handle login errors
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
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

              {/* Error Message */}
              {error && (
                <Text color="red.500" textAlign="center">
                  {error}
                </Text>
              )}

              <FormControl id="userName" isRequired>
                <FormLabel>Vartotojo vardas</FormLabel>
                <Input
                  type="text"
                  placeholder="Įveskite vartotojo vardą"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </FormControl>

              {/* Password Input */}
              <FormControl id="password" isRequired>
                <FormLabel>Slaptažodis</FormLabel>
                <Input
                  type="password"
                  placeholder="Įveskite slaptažodį"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              {/* Login Button */}
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

export default AdminLoginScreen;
