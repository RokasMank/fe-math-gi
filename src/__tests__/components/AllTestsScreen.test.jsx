import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";

jest.mock("../../apiClient");
import api from "../../apiClient";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

import AllTestsScreen from "../../AdminScreens/Main/AllTestsScreen";

const MOCK_TESTS = [
  { id: "t1", title: "Matematikos testas", description: "Algebra" },
  { id: "t2", title: "Lietuvių kalbos testas", description: "Gramatika" },
];

describe("AllTestsScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows a spinner while loading", () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<AllTestsScreen />);
    expect(document.querySelector(".chakra-spinner")).not.toBeNull();
  });

  it("renders the page heading after load", async () => {
    api.get.mockResolvedValue({ data: MOCK_TESTS });
    renderWithProviders(<AllTestsScreen />);
    await waitFor(() => {
      expect(screen.getByText("Visi testai")).toBeInTheDocument();
    });
  });

  it("renders all test titles", async () => {
    api.get.mockResolvedValue({ data: MOCK_TESTS });
    renderWithProviders(<AllTestsScreen />);
    await waitFor(() => {
      expect(screen.getByText("Matematikos testas")).toBeInTheDocument();
      expect(screen.getByText("Lietuvių kalbos testas")).toBeInTheDocument();
    });
  });

  it("navigates to test details when a test is clicked", async () => {
    api.get.mockResolvedValue({ data: MOCK_TESTS });
    renderWithProviders(<AllTestsScreen />);
    await waitFor(() => screen.getByText("Matematikos testas"));
    fireEvent.click(screen.getByText("Matematikos testas"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/test/t1");
  });
});

