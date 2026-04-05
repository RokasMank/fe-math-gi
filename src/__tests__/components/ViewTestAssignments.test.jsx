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

import ViewTestAssignmentsScreen from "../../AdminScreens/Main/ViewTestAssignments";

const MOCK_ASSIGNMENTS = [
  { id: "a1", title: "1A Matematika", description: "Testas", class: "1A", testAssignmentStatus: 0 },
  { id: "a2", title: "2B Lietuva",    description: "Rašinys", class: "2B", testAssignmentStatus: 1 },
  { id: "a3", title: "3C Istorija",   description: "Egzaminas", class: "3C", testAssignmentStatus: 2 },
];

describe("ViewTestAssignmentsScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows a spinner while loading", () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<ViewTestAssignmentsScreen />);
    expect(document.querySelector(".chakra-spinner")).not.toBeNull();
  });

  it("shows empty message when no assignments exist", async () => {
    api.get.mockResolvedValue({ data: [] });
    renderWithProviders(<ViewTestAssignmentsScreen />);
    await waitFor(() => {
      expect(screen.getByText("Priskyrimų nerasta.")).toBeInTheDocument();
    });
  });

  it("renders assignment titles", async () => {
    api.get.mockResolvedValue({ data: MOCK_ASSIGNMENTS });
    renderWithProviders(<ViewTestAssignmentsScreen />);
    await waitFor(() => {
      expect(screen.getByText("1A Matematika")).toBeInTheDocument();
      expect(screen.getByText("2B Lietuva")).toBeInTheDocument();
      expect(screen.getByText("3C Istorija")).toBeInTheDocument();
    });
  });

  it("displays correct Lithuanian status text for all three statuses", async () => {
    api.get.mockResolvedValue({ data: MOCK_ASSIGNMENTS });
    renderWithProviders(<ViewTestAssignmentsScreen />);
    await waitFor(() => {
      expect(screen.getByText("Juodraštis")).toBeInTheDocument();
      expect(screen.getByText("Paskelbtas")).toBeInTheDocument();
      expect(screen.getByText("Baigtas")).toBeInTheDocument();
    });
  });

  it("navigates to assignment details on Peržiūrėti click", async () => {
    api.get.mockResolvedValue({ data: MOCK_ASSIGNMENTS });
    renderWithProviders(<ViewTestAssignmentsScreen />);
    await waitFor(() => screen.getAllByRole("button", { name: /peržiūrėti/i }));
    fireEvent.click(screen.getAllByRole("button", { name: /peržiūrėti/i })[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/view-assignment/a1");
  });
});

