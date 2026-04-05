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

import CreateTestScreen from "../../AdminScreens/Main/CreateTestScreen";

describe("CreateTestScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders form fields and submit button", () => {
    renderWithProviders(<CreateTestScreen />);
    // Both heading and button share this text
    expect(screen.getAllByText("Sukurti testą").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByPlaceholderText(/įveskite testo pavadinimą/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/įveskite testo aprašymą/i)).toBeInTheDocument();
  });

  it("calls api.post with title and description", async () => {
    api.post.mockResolvedValue({ data: { id: "t99" } });
    renderWithProviders(<CreateTestScreen />);

    fireEvent.change(screen.getByPlaceholderText(/įveskite testo pavadinimą/i), {
      target: { value: "Algebros testas" },
    });
    fireEvent.change(screen.getByPlaceholderText(/įveskite testo aprašymą/i), {
      target: { value: "Pirmas skyrius" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sukurti testą/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/Test", {
        title: "Algebros testas",
        description: "Pirmas skyrius",
      });
    });
  });

  it("navigates to add-questions page after creation", async () => {
    api.post.mockResolvedValue({ data: { id: "t99" } });
    renderWithProviders(<CreateTestScreen />);
    fireEvent.click(screen.getByRole("button", { name: /sukurti testą/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("add-questions/t99");
    });
  });

  it("shows success toast on creation", async () => {
    api.post.mockResolvedValue({ data: { id: "t99" } });
    renderWithProviders(<CreateTestScreen />);
    fireEvent.click(screen.getByRole("button", { name: /sukurti testą/i }));
    await waitFor(() => {
      expect(screen.getByText("Testas sukurtas.")).toBeInTheDocument();
    });
  });

  it("shows error toast on failure", async () => {
    api.post.mockRejectedValue({
      response: { data: { message: "Serverio klaida" } },
    });
    renderWithProviders(<CreateTestScreen />);
    fireEvent.click(screen.getByRole("button", { name: /sukurti testą/i }));
    await waitFor(() => {
      expect(screen.getByText("Serverio klaida")).toBeInTheDocument();
    });
  });
});

