import React from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box mt={4} px={4}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
