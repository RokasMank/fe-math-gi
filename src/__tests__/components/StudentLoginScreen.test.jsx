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

import StudentLoginScreen from "../../StudentScreens/LoginScreen/LoginScreen";

describe("StudentLoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders heading, code input and login button", () => {
    renderWithProviders(<StudentLoginScreen />);
    expect(screen.getByText("Prisijungimas")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/įveskite kodą/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /prisijungti/i })).toBeInTheDocument();
  });

  it("saves studentId and navigates on successful login", async () => {
    api.post.mockResolvedValue({ data: { id: "s99", code: "S001" } });
    renderWithProviders(<StudentLoginScreen />);

    fireEvent.change(screen.getByPlaceholderText(/įveskite kodą/i), {
      target: { value: "S001" },
    });
    fireEvent.click(screen.getByRole("button", { name: /prisijungti/i }));

    await waitFor(() => {
      expect(localStorage.getItem("studentId")).toBe("s99");
      expect(localStorage.getItem("studentCode")).toBe("S001");
      expect(mockNavigate).toHaveBeenCalledWith("/main", expect.anything());
    });
  });

  it("shows error toast when code input is empty", async () => {
    renderWithProviders(<StudentLoginScreen />);
    fireEvent.click(screen.getByRole("button", { name: /prisijungti/i }));
    await waitFor(() => {
      expect(screen.getByText("Klaida")).toBeInTheDocument();
    });
  });

  it("shows error toast on failed API call", async () => {
    api.post.mockRejectedValue({ message: "Not found" });
    renderWithProviders(<StudentLoginScreen />);
    fireEvent.change(screen.getByPlaceholderText(/įveskite kodą/i), {
      target: { value: "BADCODE" },
    });
    fireEvent.click(screen.getByRole("button", { name: /prisijungti/i }));
    await waitFor(() => {
      expect(screen.getByText(/prisijungimas nepavyko/i)).toBeInTheDocument();
    });
  });
});

