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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../../apiClient";

function AdminCreateScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleCreateAdmin = async () => {
    try {
      await api.post("/admin/create", { username, password });
      toast({
        title: "Admin Created.",
        description: "The admin has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setUsername("");
      setPassword("");
    } catch (error) {
      toast({
        title: "Error Creating Admin.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card>
        <CardBody>
          <VStack spacing={4} maxW="md">
            <Heading size="lg" mb={4}>
              Create Admin
            </Heading>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" onClick={handleCreateAdmin}>
              Create Admin
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default AdminCreateScreen;
