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

  const toast = useToast();

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
      console.log("Fetching students with params:", params); // Debug log

      // Manually construct query string
      const query = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
      const url = query ? `/Student/list?${query}` : "/Student";
      console.log("Constructed URL:", url); // Debug log

      const response = await api.get(url);
      const newStudents = response.data.students;

      setStudents((prev) => (reset ? newStudents : [...prev, ...newStudents]));
      setHasMore(newStudents.length === 10); // Assume pageSize=10
      if (reset) setPage(1);
    } catch (error) {
      console.error("Fetch students error:", error, error.response?.data); // Debug log
      toast({
        title: "Error Fetching Students",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
      toast({
        title: "Invalid Class",
        description: "Class must not be empty.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await api.post("/Student/create", {
        code,
        gender,
        class: studentClass,
        school,
      });
      toast({
        title: "Student Added",
        description: "The student has been successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setCode("");
      setGender("");
      setStudentClass("");
      setSchool("");
      fetchStudents(true); // Refresh student list
    } catch (error) {
      if (error.response?.status === 409) {
        toast({
          title: "Error Adding Student",
          description: "Student with this code already exists.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error Adding Student",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Handle CSV file upload
  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      await api.post("/Student/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({
        title: "Students Uploaded",
        description:
          "Students have been successfully uploaded from the CSV file.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setCsvFile(null);
      fileInputRef.current.value = null;
      fetchStudents(true); // Refresh student list
    } catch (error) {
      toast({
        title: "Error Uploading Students",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
              Add Student
            </Heading>
            <VStack spacing={4}>
              <FormControl id="code" isRequired>
                <FormLabel>Code</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter student code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </FormControl>
              <FormControl id="gender" isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  placeholder="Select gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
              <FormControl id="class" isRequired>
                <FormLabel>Class</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter class (e.g., 10A, 11B)"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                />
              </FormControl>
              <FormControl id="school" isRequired>
                <FormLabel>School</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter school name"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="teal" onClick={handleAddStudent}>
                Add Student
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Bulk Add Students via CSV */}
        <Card>
          <CardBody>
            <Heading size="lg" mb={4}>
              Bulk Add Students
            </Heading>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Upload CSV File</FormLabel>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  ref={fileInputRef}
                />
              </FormControl>
              <Button colorScheme="teal" onClick={handleCsvUpload}>
                Upload CSV
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Student List with Filters */}
        <Card>
          <CardBody>
            <Heading size="lg" mb={4}>
              Students
            </Heading>
            <VStack spacing={4} align="stretch">
              {/* Filters */}
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Filter by Code</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by code"
                      value={filters.code}
                      onChange={(e) =>
                        handleFilterChange("code", e.target.value)
                      }
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Filter by Gender</FormLabel>
                  <Select
                    placeholder="Select gender"
                    value={filters.gender}
                    onChange={(e) =>
                      handleFilterChange("gender", e.target.value)
                    }
                  >
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Filter by Class</FormLabel>
                  <Input
                    placeholder="Enter class"
                    value={filters.class}
                    onChange={(e) =>
                      handleFilterChange("class", e.target.value)
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Filter by School</FormLabel>
                  <Input
                    placeholder="Enter school"
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
                    <Th>Code</Th>
                    <Th>Gender</Th>
                    <Th>Class</Th>
                    <Th>School</Th>
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
              {loading && <Box textAlign="center">Loading...</Box>}
              {hasMore && !loading && (
                <Button
                  colorScheme="teal"
                  onClick={handleLoadMore}
                  mt={4}
                  alignSelf="center"
                >
                  Load More
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
