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

import AdminCreateScreen from "../../AdminScreens/Main/AdminCreateScreen";

describe("AdminCreateScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders heading, inputs and submit button", () => {
    renderWithProviders(<AdminCreateScreen />);
    // Both heading and button share this text — check there are at least 2 occurrences
    expect(screen.getAllByText("Sukurti administratorių").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByPlaceholderText(/įveskite vartotojo vardą/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/įveskite slaptažodį/i)).toBeInTheDocument();
  });

  it("calls api.post with username and password", async () => {
    api.post.mockResolvedValue({ data: {} });
    renderWithProviders(<AdminCreateScreen />);

    fireEvent.change(screen.getByPlaceholderText(/įveskite vartotojo vardą/i), {
      target: { value: "newadmin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/įveskite slaptažodį/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sukurti administratorių/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/admin/create", {
        username: "newadmin",
        password: "secret",
      });
    });
  });

  it("shows success toast on creation", async () => {
    api.post.mockResolvedValue({ data: {} });
    renderWithProviders(<AdminCreateScreen />);
    fireEvent.click(screen.getByRole("button", { name: /sukurti administratorių/i }));
    await waitFor(() => {
      expect(screen.getByText("Administratorius sukurtas.")).toBeInTheDocument();
    });
  });

  it("clears inputs after successful creation", async () => {
    api.post.mockResolvedValue({ data: {} });
    renderWithProviders(<AdminCreateScreen />);
    const input = screen.getByPlaceholderText(/įveskite vartotojo vardą/i);
    fireEvent.change(input, { target: { value: "admin2" } });
    fireEvent.click(screen.getByRole("button", { name: /sukurti administratorių/i }));
    await waitFor(() => expect(input.value).toBe(""));
  });

  it("shows error toast on failure", async () => {
    api.post.mockRejectedValue({
      response: { data: { message: "Vartotojas jau egzistuoja" } },
    });
    renderWithProviders(<AdminCreateScreen />);
    fireEvent.click(screen.getByRole("button", { name: /sukurti administratorių/i }));
    await waitFor(() => {
      expect(screen.getByText("Vartotojas jau egzistuoja")).toBeInTheDocument();
    });
  });
});

