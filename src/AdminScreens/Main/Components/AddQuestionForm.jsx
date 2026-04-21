import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  HStack,
  VStack,
  IconButton,
  Box,
  Checkbox,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../../../apiClient";
import { DEFAULT_QUESTION } from "../../../utils/defaultQuestion";
import { buildQueryString } from "../../../utils/buildQueryString";

const QUESTION_CATEGORY_OPTIONS = ["CatOne", "CatTwo", "CatThree"];
const CONTENT_TYPE_OPTIONS = ["NumbersAndCalculations", "ModelsAndRelationships", "GeometryAndMeasurements", "DataAndProbability"];
const ACHIEVEMENT_AREA_OPTIONS = ["KnowledgeUnderstandingArgumentation", "MathematicalCommunication", "ProblemSolving"];

const QUESTION_TYPE_OPTIONS = [
  { value: "", label: "Visi" },
  { value: "1", label: "Atviras atsakymas" },
  { value: "2", label: "Keli teisingi atsakymai" },
  { value: "3", label: "Vienas teisingas atsakymas" },
  { value: "4", label: "Užpildyti tuščius laukus" },
];

const CATEGORY_LABELS = {
  0: "CatOne",
  1: "CatTwo",
  2: "CatThree",
  CatOne: "CatOne",
  CatTwo: "CatTwo",
  CatThree: "CatThree",
};

const CONTENT_TYPE_LABELS = {
  1: "Skaičiai ir skaičiavimai",
  2: "Modeliai ir sąryšiai",
  3: "Geometrija ir matavimai",
  4: "Duomenys ir tikimybės",
  NumbersAndCalculations: "Skaičiai ir skaičiavimai",
  ModelsAndRelationships: "Modeliai ir sąryšiai",
  GeometryAndMeasurements: "Geometrija ir matavimai",
  DataAndProbability: "Duomenys ir tikimybės",
};

const ACHIEVEMENT_AREA_LABELS = {
  1: "Žinios, supratimas ir argumentavimas",
  2: "Matematinis komunikavimas",
  3: "Problemų sprendimas",
  KnowledgeUnderstandingArgumentation: "Žinios, supratimas ir argumentavimas",
  MathematicalCommunication: "Matematinis komunikavimas",
  ProblemSolving: "Problemų sprendimas",
};

const QUESTION_TYPE_LABELS = {
  1: "Atviras atsakymas",
  2: "Keli teisingi atsakymai",
  3: "Vienas teisingas atsakymas",
  4: "Užpildyti tuščius laukus",
  OpenEnded: "Atviras atsakymas",
  MultipleChoice: "Keli teisingi atsakymai",
  SingleChoice: "Vienas teisingas atsakymas",
  FillInBlanks: "Užpildyti tuščius laukus",
};

function formatEnumLabel(value, labels) {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  return (
    labels[value] ||
    labels[String(value)] ||
    labels[Number(value)] ||
    String(value)
  );
}

function getQuestionTypeLabel(type) {
  if (type === undefined || type === null || type === "") {
    return "";
  }
  return (
    QUESTION_TYPE_LABELS[type] ||
    QUESTION_TYPE_LABELS[Number(type)] ||
    String(type)
  );
}

function QuestionForm({ question, setQuestion, removeSubQuestion }) {
  const handleAddOption = () => {
    setQuestion({
      ...question,
      options: [...question.options, ""],
    });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = question.options.filter((_, i) => i !== index);
    const updatedCorrectAnswers = question.correctAnswers.filter((answer) =>
      updatedOptions.includes(answer),
    );
    setQuestion({
      ...question,
      options: updatedOptions,
      correctAnswers: updatedCorrectAnswers,
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...question.options];
    updatedOptions[index] = value;
    setQuestion({
      ...question,
      options: updatedOptions,
    });
  };

  const handleAddSubQuestion = () => {
    setQuestion({
      ...question,
      subQuestions: [
        ...question.subQuestions,
        {
          text: "",
          points: "",
          questionType: "",
          options: [],
          correctAnswers: [],
          imageUrl: "",
          subQuestions: [],
          allowsEmptyAnswer: false,
          textWithBlanks: "",
          questionCategoryClass: "CatOne",
          contentType: "NumbersAndCalculations",
          achievementArea: "KnowledgeUnderstandingArgumentation",
        },
      ],
    });
  };

  const handleRemoveSubQuestion = (index) => {
    setQuestion({
      ...question,
      subQuestions: question.subQuestions.filter((_, i) => i !== index),
    });
  };

  const handleSubQuestionChange = (index, updatedSubQuestion) => {
    const updatedSubQuestions = [...question.subQuestions];
    updatedSubQuestions[index] = updatedSubQuestion;
    setQuestion({
      ...question,
      subQuestions: updatedSubQuestions,
    });
  };

  // Funkcija, kuri skaičiuoja tuščių laukų skaičių tekste
  const countBlank = (text) => {
    return (text.match(/\[\[\]\]/g) || []).length;
  };

  // Funkcija, kuri valdo teisingų atsakymų įvestį FillInBlanks tipo klausimams
  const handleCorrectAnswerChange = (index, value) => {
    const updatedCorrectAnswers = [...question.correctAnswers];
    updatedCorrectAnswers[index] = value;
    setQuestion({
      ...question,
      correctAnswers: updatedCorrectAnswers,
    });
  };

  // Funkcija, kuri sinchronizuoja teisingų atsakymų masyvą su tuščių laukų skaičiumi
  const handleTextWithBlanksChange = (value) => {
    const blankCount = countBlank(value);
    const updatedCorrectAnswers = question.correctAnswers.slice(0, blankCount);
    while (updatedCorrectAnswers.length < blankCount) {
      updatedCorrectAnswers.push("");
    }
    setQuestion({
      ...question,
      textWithBlanks: value,
      correctAnswers: updatedCorrectAnswers,
    });
  };

  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      padding={4}
      width="100%"
      marginBottom={4}
    >
      <FormControl id="text" isRequired>
        <FormLabel>Klausimo tekstas</FormLabel>
        <Textarea
          placeholder="Įveskite klausimo tekstą"
          value={question.text}
          onChange={(e) => setQuestion({ ...question, text: e.target.value })}
        />
      </FormControl>
      <FormControl id="imageUrl">
        <FormLabel>Paveikslėlio URL</FormLabel>
        <Input
          placeholder="Įveskite paveikslėlio URL"
          value={question.imageUrl}
          onChange={(e) =>
            setQuestion({ ...question, imageUrl: e.target.value })
          }
        />
      </FormControl>
      {/* <FormControl id="explanation">
        <FormLabel>Explanation (Optional)</FormLabel>
        <Textarea
          placeholder="Enter explanation for the question or correct answer"
          value={question.explanation || ""}
          onChange={(e) =>
            setQuestion({ ...question, explanation: e.target.value })
          }
        />
      </FormControl> */}
      <HStack spacing={4}>
        <FormControl isRequired id="points">
          <FormLabel>Taškai</FormLabel>
          <Input
            placeholder="Įveskite taškų skaičių"
            value={question.points}
            onChange={(e) =>
              setQuestion({ ...question, points: e.target.value })
            }
          />
        </FormControl>
        <FormControl id="questionType" isRequired>
          <FormLabel>Klausimo tipas</FormLabel>
          <Select
            placeholder="Pasirinkite klausimo tipą"
            value={question.questionType}
            onChange={(e) => {
              setQuestion({
                ...question,
                questionType: e.target.value,
                options: [],
                correctAnswers: [],
                textWithBlanks: "",
              });
            }}
          >
            <option value="MultipleChoice">Keli teisingi atsakymai</option>
            <option value="SingleChoice">Vienas teisingas atsakymas</option>
            <option value="OpenEnded">Atviras atsakymas</option>
            <option value="FillInBlanks">Užpildyti tuščius laukus</option>
          </Select>
        </FormControl>
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} marginTop={3}>
        <FormControl id="questionCategoryClass" isRequired>
          <FormLabel>Klausimo kategorija</FormLabel>
          <Select
            value={question.questionCategoryClass || "CatOne"}
            onChange={(e) =>
              setQuestion({
                ...question,
                questionCategoryClass: e.target.value,
              })
            }
          >
            {QUESTION_CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="contentType" isRequired>
          <FormLabel>Turinio tipas</FormLabel>
          <Select
            value={question.contentType || "CotOne"}
            onChange={(e) =>
              setQuestion({ ...question, contentType: e.target.value })
            }
          >
            {CONTENT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="achievementArea" isRequired>
          <FormLabel>Pasiekimų sritis</FormLabel>
          <Select
            value={question.achievementArea || "AOne"}
            onChange={(e) =>
              setQuestion({ ...question, achievementArea: e.target.value })
            }
          >
            {ACHIEVEMENT_AREA_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormControl>
      </SimpleGrid>
      {question.questionType === "OpenEnded" && (
        <>
          <FormControl id="correctAnswers">
            <FormLabel>Teisingas atsakymas</FormLabel>
            <Textarea
              placeholder="Įveskite teisingą atsakymą"
              value={question.correctAnswers.join("\n")}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  correctAnswers: e.target.value
                    .split("\n")
                    .map((line) => line.trim()),
                })
              }
            />
          </FormControl>
          <FormControl display="flex" alignItems="center" marginTop={4}>
            <Checkbox
              isChecked={question.allowsEmptyAnswer}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  allowsEmptyAnswer: e.target.checked,
                })
              }
            >
              Leisti tuščią atsakymą
            </Checkbox>
          </FormControl>
          <FormControl display="flex" alignItems="center" marginTop={4}>
            <Checkbox
              isChecked={question.setMaxChars}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  setMaxChars: e.target.checked,
                  maxCharsAllowed: e.target.checked ? 1 : null,
                })
              }
            >
              Nustatyti maksimalų simbolių limitą
            </Checkbox>
          </FormControl>
          {question.setMaxChars && (
            <FormControl id="maxCharsAllowed" isRequired marginTop={2}>
              <FormLabel>
                Maksimalus simbolių skaičius (atsižvelkite į skyrybos ženklus!!
                (,.))
              </FormLabel>
              <Input
                type="number"
                placeholder="Įveskite maksimalų simbolių skaičių (1-5000)"
                value={question.maxCharsAllowed || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value > 0 && value <= 5000) {
                    setQuestion({ ...question, maxCharsAllowed: value });
                  }
                }}
              />
            </FormControl>
          )}
        </>
      )}
      {(question.questionType === "MultipleChoice" ||
        question.questionType === "SingleChoice") && (
        <FormControl id="options">
          <FormLabel>Variantai</FormLabel>
          <VStack spacing={2}>
            {question.options.map((option, index) => (
              <HStack key={index}>
                <Input
                  placeholder={`Variantas ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <Checkbox
                  isChecked={question.correctAnswers.includes(option)}
                  onChange={() => {
                    if (question.questionType === "SingleChoice") {
                      setQuestion({
                        ...question,
                        correctAnswers: [option],
                      });
                    } else {
                      setQuestion({
                        ...question,
                        correctAnswers: question.correctAnswers.includes(option)
                          ? question.correctAnswers.filter(
                            (ans) => ans !== option,
                          )
                        : [...question.correctAnswers, option],
                    });
                  }}
                >
                  Pažymėti kaip teisingą
                </Checkbox>
                <IconButton
                  aria-label="Remove option"
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={() => handleRemoveOption(index)}
                />
              </HStack>
            ))}
            <Button
              leftIcon={<FaPlus />}
              onClick={handleAddOption}
              colorScheme="teal"
              size="sm"
            >
              Pridėti variantą
            </Button>
          </VStack>
        </FormControl>
      )}
      {question.questionType === "FillInBlanks" && (
        <>
          <FormControl id="textWithBlanks" isRequired>
            <FormLabel>Tekstas su tuščiais laukais</FormLabel>
            <Textarea
              placeholder="Įveskite tekstą su tuščiais laukais (naudokite [[]] tuščioms vietoms, pvz., 'Sostinė yra [[]]. Šalis yra [[]].')"
              value={question.textWithBlanks || ""}
              onChange={(e) => handleTextWithBlanksChange(e.target.value)}
            />
          </FormControl>
          <FormControl id="correctAnswers">
            <FormLabel>Teisingi atsakymai į tuščius laukus</FormLabel>
            <VStack spacing={2}>
              {question.correctAnswers.map((answer, index) => (
                <HStack key={index}>
                  <Input
                    placeholder={`Atsakymas į ${index + 1} tuščią lauką`}
                    value={answer}
                    onChange={(e) =>
                      handleCorrectAnswerChange(index, e.target.value)
                    }
                  />
                  <IconButton
                    aria-label="Remove answer"
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => {
                      const updatedAnswers = question.correctAnswers.filter(
                        (_, i) => i !== index,
                      );
                      setQuestion({
                        ...question,
                        correctAnswers: updatedAnswers,
                      });
                    }}
                    isDisabled={
                      question.correctAnswers.length <=
                      countBlank(question.textWithBlanks)
                    }
                  />
                </HStack>
              ))}
            </VStack>
          </FormControl>
        </>
      )}
      <VStack spacing={4} align="start" marginTop={4}>
        <FormLabel>Poklausimai</FormLabel>
        {question.subQuestions.map((subQuestion, index) => (
          <Box key={index} borderWidth={1} borderRadius="md" padding={4}>
            <QuestionForm
              question={subQuestion}
              setQuestion={(updatedSubQuestion) =>
                handleSubQuestionChange(index, updatedSubQuestion)
              }
              removeSubQuestion={() => handleRemoveSubQuestion(index)}
            />
            <Button
              colorScheme="red"
              size="sm"
              marginTop={2}
              onClick={() => handleRemoveSubQuestion(index)}
            >
              Pašalinti poklausimą
            </Button>
          </Box>
        ))}
        <Button
          leftIcon={<FaPlus />}
          onClick={handleAddSubQuestion}
          colorScheme="teal"
          size="sm"
        >
          Pridėti poklausimą
        </Button>
      </VStack>
    </Box>
  );
}

function AddQuestionForm({ testId, toast, callback }) {
  const [question, setQuestion] = useState({ ...DEFAULT_QUESTION });
  const [bankQuestions, setBankQuestions] = useState([]);
  const [loadingBank, setLoadingBank] = useState(false);
  const [bankPointsByQuestionId, setBankPointsByQuestionId] = useState({});
  const [bankFilters, setBankFilters] = useState({
    questionType: "",
    questionCategoryClass: "",
    contentType: "",
    achievementArea: "",
  });

  const fetchBankQuestions = async () => {
    setLoadingBank(true);
    try {
      const query = buildQueryString(bankFilters);
      const url = query ? `/Question/bank?${query}` : "/Question/bank";
      const response = await api.get(url);
      setBankQuestions(response.data || []);
    } catch (error) {
      toast(
        "Klaida įkeliant klausimų banką",
        error.response?.data?.message || "Kažkas nutiko.",
        "error",
      );
    } finally {
      setLoadingBank(false);
    }
  };

  useEffect(() => {
    fetchBankQuestions();
  }, [bankFilters]);

  const handleAddQuestion = async () => {
    if (question.questionType === "FillInBlanks") {
      const countBlank = (text) => (text.match(/\[\[\]\]/g) || []).length;
      const blankCount = countBlank(question.textWithBlanks);
      if (blankCount === 0) {
        toast(
          "Klaida pridedant klausimą",
          "Tekstas su tuščiais laukais turi turėti bent vieną [[]].",
          "error",
        );
        return;
      }
      if (
        question.correctAnswers.length !== blankCount ||
        question.correctAnswers.some((answer) => !answer.trim())
      ) {
        toast(
          "Klaida pridedant klausimą",
          "Prašome pateikti teisingą atsakymą kiekvienam tuščiam laukui ([[]]).",
          "error",
        );
        return;
      }
    }

    try {
      await api.post(`/Question/${testId}/questions`, question);
      toast("Klausimas pridėtas", "Klausimas sėkmingai pridėtas.");
      setQuestion({ ...DEFAULT_QUESTION });
      callback();
      fetchBankQuestions();
    } catch (error) {
      toast(
        "Klaida pridedant klausimą",
        error.response?.data?.message || "Kažkas nutiko.",
        "error",
      );
    }
  };

  const handleAddFromBank = async (questionId) => {
    const defaultPoints = parseInt(
      bankPointsByQuestionId[questionId] || "1",
      10,
    );

    if (!defaultPoints || defaultPoints < 1) {
      toast(
        "Neteisingi taškai",
        "Taškų skaičius turi būti didesnis nei 0.",
        "error",
      );
      return;
    }

    try {
      await api.post(`/Question/${testId}/questions/from-bank`, {
        questionId,
        defaultPoints,
      });
      toast(
        "Klausimas susietas",
        "Klausimas iš banko pridėtas prie šio testo.",
      );
      callback();
    } catch (error) {
      toast(
        "Klaida susiejant klausimą",
        error.response?.data?.message || "Kažkas nutiko.",
        "error",
      );
    }
  };

  return (
    <Box>
      <Tabs variant="enclosed" colorScheme="teal" marginBottom={4}>
        <TabList>
          <Tab>Sukurti naują klausimą</Tab>
          <Tab>Pasirinkti iš klausimų banko</Tab>
        </TabList>

        <TabPanels>
          <TabPanel paddingX={0}>
            <QuestionForm question={question} setQuestion={setQuestion} />
            <Button colorScheme="teal" onClick={handleAddQuestion}>
              Pridėti klausimą
            </Button>
          </TabPanel>

          <TabPanel paddingX={0}>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={3}
              marginBottom={4}
            >
              <FormControl>
                <FormLabel>Klausimo tipas</FormLabel>
                <Select
                  value={bankFilters.questionType}
                  onChange={(e) =>
                    setBankFilters((prev) => ({
                      ...prev,
                      questionType: e.target.value,
                    }))
                  }
                >
                  {QUESTION_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Klausimo kategorija</FormLabel>
                <Select
                  value={bankFilters.questionCategoryClass}
                  onChange={(e) =>
                    setBankFilters((prev) => ({
                      ...prev,
                      questionCategoryClass: e.target.value,
                    }))
                  }
                >
                  <option value="">Visi</option>
                  {QUESTION_CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Turinio tipas</FormLabel>
                <Select
                  value={bankFilters.contentType}
                  onChange={(e) =>
                    setBankFilters((prev) => ({
                      ...prev,
                      contentType: e.target.value,
                    }))
                  }
                >
                  <option value="">Visi</option>
                  {CONTENT_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Pasiekimų sritis</FormLabel>
                <Select
                  value={bankFilters.achievementArea}
                  onChange={(e) =>
                    setBankFilters((prev) => ({
                      ...prev,
                      achievementArea: e.target.value,
                    }))
                  }
                >
                  <option value="">Visi</option>
                  {ACHIEVEMENT_AREA_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            {loadingBank ? (
              <Text>Kraunamas klausimų bankas...</Text>
            ) : bankQuestions.length === 0 ? (
              <Text>Pasirinktais filtrais klausimų nerasta.</Text>
            ) : (
              <VStack align="stretch" spacing={3}>
                {bankQuestions.map((bankQuestion) => (
                  <Box
                    key={bankQuestion.id}
                    borderWidth={1}
                    borderRadius="md"
                    padding={4}
                  >
                    <Text fontWeight="bold">{bankQuestion.text}</Text>
                    <Text fontSize="sm">
                      Tipas: {getQuestionTypeLabel(bankQuestion.questionType)}
                    </Text>
                    <Text fontSize="sm">
                      Kategorija:{" "}
                      {formatEnumLabel(
                        bankQuestion.questionCategoryClass,
                        CATEGORY_LABELS,
                      )}{" "}
                      | Turinio tipas:{" "}
                      {formatEnumLabel(
                        bankQuestion.contentType,
                        CONTENT_TYPE_LABELS,
                      )}
                    </Text>
                    <Text fontSize="sm">
                      Pasiekimų sritis:{" "}
                      {formatEnumLabel(
                        bankQuestion.achievementArea,
                        ACHIEVEMENT_AREA_LABELS,
                      )}
                    </Text>
                    {bankQuestion.options?.length > 0 && (
                      <Box marginTop={2}>
                        <Text fontWeight="bold">Variantai:</Text>
                        <VStack align="start" spacing={1}>
                          {bankQuestion.options.map((option, index) => (
                            <Text key={index}>- {option}</Text>
                          ))}
                        </VStack>
                      </Box>
                    )}
                    {bankQuestion.textWithBlanks && (
                        <Box marginTop={2}>
                          <Text fontWeight="bold">
                            Tekstas su tuščiais laukais:
                          </Text>
                          <Text>{bankQuestion.textWithBlanks}</Text>
                        </Box>
                      )}
                    {bankQuestion.correctAnswers?.length > 0 && (
                      <Box marginTop={2}>
                        <Text fontWeight="bold">Teisingi atsakymai:</Text>
                        <VStack align="start" spacing={1}>
                          {bankQuestion.correctAnswers.map((answer, index) => (
                            <Text key={index}>- {answer}</Text>
                          ))}
                        </VStack>
                      </Box>
                    )}
                    {bankQuestion.maxCharsAllowed ? (
                      <Text fontSize="sm" marginTop={2}>
                        Maks. simbolių: {bankQuestion.maxCharsAllowed}
                      </Text>
                    ) : null}
                    <HStack marginTop={3}>
                      <Input
                        type="number"
                        width="140px"
                        value={bankPointsByQuestionId[bankQuestion.id] || "1"}
                        onChange={(e) =>
                          setBankPointsByQuestionId((prev) => ({
                            ...prev,
                            [bankQuestion.id]: e.target.value,
                          }))
                        }
                      />
                      <Button
                        colorScheme="teal"
                        onClick={() => handleAddFromBank(bankQuestion.id)}
                      >
                        Pridėti į testą
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default AddQuestionForm;
