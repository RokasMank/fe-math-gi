import {
  Container,
  Card,
  CardBody,
  Button,
  CardHeader,
  Box,
} from "@chakra-ui/react";

import { useState } from "react";

const StudentMain = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  const handleTestStart = () => {
    setTestStarted(true);

    //api call to start session {userToken} and {currentTime}
  };
  const handleTestFinish = () => {
    setTestFinished(true);
    setTestStarted(false);

    // api call to finish test
  };
  return (
    <Container
      height={"100vh"}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {!testStarted ? (
        <Container>
          <Card>
            <CardHeader>Testo pavadinimas</CardHeader>

            <CardBody>
              <Box>Testas atidaromas:</Box>
              <Box>Testo trukmė: </Box>
            </CardBody>

            <Button onClick={() => handleTestStart()}>Pradėti</Button>
          </Card>
        </Container>
      ) : (
        <Container>
          <Card>
            <CardHeader>Klausimas</CardHeader>

            <CardBody>
              <Box>SMth:</Box>
              <Box>Testo trukmė: </Box>
            </CardBody>

            <Button onClick={() => handleTestStart()}>Pradėti</Button>
          </Card>
          <Button onClick={() => handleTestFinish()}>Baigti</Button>
        </Container>
      )}
    </Container>
  );
};

export default StudentMain;
