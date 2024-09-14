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

function LoginScreen() {
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

              <FormControl id="email" isRequired>
                <FormLabel>El. paštas</FormLabel>
                <Input type="email" placeholder="Įveskite el. paštą" />
              </FormControl>

              {/* Code Field */}
              <FormControl id="code" isRequired>
                <FormLabel>Kodas</FormLabel>
                <Input type="text" placeholder="Įveskite kodą" />
              </FormControl>

              {/* Submit Button */}
              <Button colorScheme="blue" w="full">
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
