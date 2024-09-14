import { Container, Card, CardBody, Button } from "@chakra-ui/react";

function StudentMain() {
  return (
    <Container
      height={"100vh"}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Container>
        <Card>
          <CardBody>Testo pavadinimas</CardBody>
          <Button>Open</Button>
        </Card>
      </Container>
    </Container>
  );
}

export default StudentMain;
