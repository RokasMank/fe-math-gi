import {
  Container,
  Card,
  CardBody,
  Button,
  CardHeader,
  Box,
} from "@chakra-ui/react";

const TestCard = () => {
  return (
    <Container>
      <Card>
        <CardHeader>Testo pavadinimas</CardHeader>

        <CardBody>
          <Box>Testas atidaromas:</Box>
          <Box>Testo trukmė: </Box>
        </CardBody>

        {/* <Button onClick={() => handleTestStart()}>Pradėti</Button> */}
      </Card>
    </Container>
  );
};

export default TestCard;
