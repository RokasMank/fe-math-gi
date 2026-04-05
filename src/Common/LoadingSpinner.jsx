import React from "react";
import { Box, Spinner } from "@chakra-ui/react";

/**
 * Full-page centred loading spinner.
 * Replaces the repeated inline Box+Spinner pattern across screens.
 */
export default function LoadingSpinner() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Spinner size="xl" />
    </Box>
  );
}

