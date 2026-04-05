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
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  HStack,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons"; // Requires @chakra-ui/icons to be installed
import { useState, useEffect, useRef } from "react";
import api from "../../apiClient";
import { useAppToast } from "../../utils/useAppToast";
import { buildQueryString } from "../../utils/buildQueryString";

function ManageStudentScreen() {
  // State for adding a single student
  const [code, setCode] = useState("");
  const [gender, setGender] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [school, setSchool] = useState("");

  // State for student list and filtering
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    code: "",
    gender: "",
    class: "",
    school: "",
  });

  // State for CSV upload
  const [csvFile, setCsvFile] = useState(null);
  const fileInputRef = useRef(null);

  const toast = useAppToast();

  // Fetch students with filters and pagination
  const fetchStudents = async (reset = false) => {
    setLoading(true);
    try {
      const params = {
        page: reset ? 1 : page,
        pageSize: 10,
        code: filters.code || undefined,
        gender: filters.gender || undefined,
        class: filters.class || undefined,
        school: filters.school || undefined,
      };
      const query = buildQueryString(params);
      const url = query ? `/Student/list?${query}` : "/Student";

      const response = await api.get(url);
      const newStudents = response.data.students;

      setStudents((prev) => (reset ? newStudents : [...prev, ...newStudents]));
      setHasMore(newStudents.length === 10); // Assume pageSize=10
      if (reset) setPage(1);
    } catch (error) {
      console.error("Fetch students error:", error, error.response?.data); // Debug log
      toast(
        "Klaida gaunant mokinius",
        error.response?.data?.message || "Kažkas nutiko.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + refetch on filter change
  useEffect(() => {
    fetchStudents(true);
  }, [filters]);

  // Fetch on page change (for load more)
  useEffect(() => {
    if (page > 1) {
      fetchStudents();
    }
  }, [page]);

  // Handle adding a single student
  const handleAddStudent = async () => {
    if (!studentClass) {
      toast("Neteisinga klasė", "Klasė negali būti tuščia.", "error");
      return;
    }

    try {
      await api.post("/Student/create", {
        code,
        gender,
        class: studentClass,
        school,
      });
      toast("Mokinys pridėtas", "Mokinys sėkmingai pridėtas.");
      setCode("");
      setGender("");
      setStudentClass("");
      setSchool("");
      fetchStudents(true); // Refresh student list
    } catch (error) {
      if (error.response?.status === 409) {
        toast(
          "Klaida pridedant mokinį",
          "Mokinys su šiuo kodu jau egzistuoja.",
          "error"
        );
      } else {
        toast(
          "Klaida pridedant mokinį",
          error.response?.data?.message || "Kažkas nutiko.",
          "error"
        );
      }
    }
  };

  // Handle CSV file upload
  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast(
        "Failas nepasirinktas",
        "Pasirinkite CSV failą, kurį norite įkelti.",
        "error"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      await api.post("/Student/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast("Mokiniai įkelti", "Mokiniai sėkmingai įkelti iš CSV failo.");
      setCsvFile(null);
      fileInputRef.current.value = null;
      fetchStudents(true); // Refresh student list
    } catch (error) {
      toast(
        "Klaida įkeliant mokinius",
        error.response?.data?.message || "Kažkas nutiko.",
        "error"
      );
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Load more students (triggers useEffect on page change)
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <Container maxW="container.xl" py={6}>
      <VStack spacing={8} align="stretch">
        {/* Add Single Student Form */}
        <Card>
          <CardBody>
            <Heading size="lg" mb={4}>
              Pridėti mokinį
            </Heading>
            <VStack spacing={4}>
              <FormControl id="code" isRequired>
                <FormLabel>Kodas</FormLabel>
                <Input
                  type="text"
                  placeholder="Įveskite mokinio kodą"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </FormControl>
              <FormControl id="gender" isRequired>
                <FormLabel>Lytis</FormLabel>
                <Select
                  placeholder="Pasirinkite lytį"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Vyras</option>
                  <option value="Female">Moteris</option>
                </Select>
              </FormControl>
              <FormControl id="class" isRequired>
                <FormLabel>Klasė</FormLabel>
                <Input
                  type="text"
                  placeholder="Įveskite klasę (pvz., 10A, 11B)"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                />
              </FormControl>
              <FormControl id="school" isRequired>
                <FormLabel>Mokykla</FormLabel>
                <Input
                  type="text"
                  placeholder="Įveskite mokyklos pavadinimą"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="teal" onClick={handleAddStudent}>
                Pridėti mokinį
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Bulk Add Students via CSV */}
        <Card>
          <CardBody>
            <Heading size="lg" mb={4}>
              Masinis mokinių įkėlimas
            </Heading>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Įkelti CSV failą</FormLabel>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  ref={fileInputRef}
                />
              </FormControl>
              <Button colorScheme="teal" onClick={handleCsvUpload}>
                Įkelti CSV
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Student List with Filters */}
        <Card>
          <CardBody>
            <Heading size="lg" mb={4}>
              Mokiniai
            </Heading>
            <VStack spacing={4} align="stretch">
              {/* Filters */}
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Filtruoti pagal kodą</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Ieškoti pagal kodą"
                      value={filters.code}
                      onChange={(e) =>
                        handleFilterChange("code", e.target.value)
                      }
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Filtruoti pagal lytį</FormLabel>
                  <Select
                    placeholder="Pasirinkite lytį"
                    value={filters.gender}
                    onChange={(e) =>
                      handleFilterChange("gender", e.target.value)
                    }
                  >
                    <option value="">Visi</option>
                    <option value="Male">Vyras</option>
                    <option value="Female">Moteris</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Filtruoti pagal klasę</FormLabel>
                  <Input
                    placeholder="Įveskite klasę"
                    value={filters.class}
                    onChange={(e) =>
                      handleFilterChange("class", e.target.value)
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Filtruoti pagal mokyklą</FormLabel>
                  <Input
                    placeholder="Įveskite mokyklą"
                    value={filters.school}
                    onChange={(e) =>
                      handleFilterChange("school", e.target.value)
                    }
                  />
                </FormControl>
              </HStack>

              {/* Student List */}
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Kodas</Th>
                    <Th>Lytis</Th>
                    <Th>Klasė</Th>
                    <Th>Mokykla</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students.map((student) => (
                    <Tr key={student.id}>
                      <Td>{student.code}</Td>
                      <Td>{student.gender}</Td>
                      <Td>{student.class}</Td>
                      <Td>{student.school}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {loading && <Box textAlign="center">Kraunama...</Box>}
              {hasMore && !loading && (
                <Button
                  colorScheme="teal"
                  onClick={handleLoadMore}
                  mt={4}
                  alignSelf="center"
                >
                  Įkelti daugiau
                </Button>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}

export default ManageStudentScreen;
