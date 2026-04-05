import React from "react";
import { render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";

/**
 * Renders a component wrapped with ChakraProvider + MemoryRouter.
 * Most components in this project need both.
 */
export function renderWithProviders(ui, { initialEntries = ["/"] } = {}) {
  return render(
    <ChakraProvider>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </ChakraProvider>
  );
}

// Needed so Jest does not complain "test suite must contain at least one test"
test.skip("testUtils is a helper, not a test suite", () => {});

