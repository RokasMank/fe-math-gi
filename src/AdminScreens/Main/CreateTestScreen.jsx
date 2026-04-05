import {
  Container,
  Card,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../../apiClient";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../../utils/useAppToast";

function CreateTestScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const toast = useAppToast();
  const navigate = useNavigate();

  const handleCreateTest = async () => {
    try {
      const response = await api.post("/Test", { title, description });
      toast("Testas sukurtas.", "Testas sėkmingai sukurtas.");
      setTitle("");
      setDescription("");
      navigate(`add-questions/${response.data.id}`);
    } catch (error) {
      toast(
        "Klaida kuriant testą.",
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
              Sukurti testą
            </Heading>
            <FormControl id="title" isRequired>
              <FormLabel>Pavadinimas</FormLabel>
              <Input
                type="text"
                placeholder="Įveskite testo pavadinimą"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl id="description">
              <FormLabel>Aprašymas</FormLabel>
              <Textarea
                placeholder="Įveskite testo aprašymą"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl id="description">
              <FormLabel>Laikas</FormLabel>
              <Input disabled placeholder="45 min" />
            </FormControl>
            <Button colorScheme="purple" onClick={handleCreateTest}>
              Sukurti testą
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default CreateTestScreen;
