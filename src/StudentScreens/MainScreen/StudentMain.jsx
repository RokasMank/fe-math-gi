import {
  Container,
  Card,
  CardBody,
  Button,
  CardHeader,
  Box,
  HStack,
  Checkbox,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";

import { useState } from "react";
import { ConfirmEnd } from "./Components/ConfirmEnd";

const StudentMain = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [openTestFinish, setOpenTestFinish] = useState(false);

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
    <Box
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

            <Button colorScheme="green" onClick={() => handleTestStart()}>
              Pradėti
            </Button>
          </Card>
        </Container>
      ) : (
        <Box>
          <Box>
            <Card>
              <CardHeader>
                <Box width={"80%"}>
                  Markas turi 28 Eur, o Tauras 12 Eur daugiau. Ar užteks
                  broliams turimų pinigų pavaizduotam kamuoliui nusipirkti?
                  Atsakymą paaiškink
                </Box>
                <Box float={"right"}>[points]</Box>
              </CardHeader>

              <CardBody>
                <Box>
                  <CheckboxGroup colorScheme="blue">
                    <Stack spacing={5} direction="column">
                      <Checkbox value="option1">Option 1</Checkbox>
                      <Checkbox value="option2">Option 2</Checkbox>
                      <Checkbox value="option3">Option 3</Checkbox>
                      <Checkbox value="option4">Option 4</Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </Box>
                <Box marginTop={"20px"}>Place for img</Box>
              </CardBody>
            </Card>
          </Box>
          <Box margin={"15px"}>
            <HStack>
              <Box>ce bus kleusimai</Box>
              <Box>
                <Button colorScheme="yellow">Kitas klausimas</Button>
              </Box>
            </HStack>
          </Box>
          <Box>
            <Button colorScheme={"red"} onClick={() => setOpenTestFinish(true)}>
              Baigti
            </Button>
          </Box>
        </Box>
      )}
      <ConfirmEnd
        open={openTestFinish}
        onClose={() => setOpenTestFinish(false)}
      />
    </Box>
  );
};

export default StudentMain;
