import React from "react";
import { Box, Flex, Text, Link, Button, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box bg="teal.500" px={4} py={3} color="white">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="lg" fontWeight="bold">
          MATH4KTU
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {localStorage.getItem("studentCode")}
        </Text>
        {localStorage.getItem("role") === "admin" && (
          <HStack spacing={4}>
            <Link onClick={() => navigate("/admin/landing")} color="white">
              Namai
            </Link>
            <Link
              onClick={() => navigate("/admin/view-assignments")}
              color="white"
            >
              Priskirti testai
            </Link>
            <Link onClick={() => navigate("/admin/all-tests")} color="white">
              Testai
            </Link>
            <Button colorScheme="red" size="sm" onClick={handleLogout}>
              Atsijungti
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
