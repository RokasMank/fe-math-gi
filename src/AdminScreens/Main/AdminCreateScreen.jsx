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
import { useState } from "react";
import api from "../../apiClient";
import { useAppToast } from "../../utils/useAppToast";

function AdminCreateScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useAppToast();

  const handleCreateAdmin = async () => {
    try {
      await api.post("/admin/create", { username, password });
      toast(
        "Administratorius sukurtas.",
        "Administratorius sėkmingai sukurtas."
      );
      setUsername("");
      setPassword("");
    } catch (error) {
      toast(
        "Klaida kuriant administratorių.",
        error.response?.data?.message || "Kažkas nutiko.",
        "error"
      );
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
              Sukurti administratorių
            </Heading>
            <FormControl id="username" isRequired>
              <FormLabel>Vartotojo vardas</FormLabel>
              <Input
                type="text"
                placeholder="Įveskite vartotojo vardą"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Slaptažodis</FormLabel>
              <Input
                type="password"
                placeholder="Įveskite slaptažodį"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" onClick={handleCreateAdmin}>
              Sukurti administratorių
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default AdminCreateScreen;
