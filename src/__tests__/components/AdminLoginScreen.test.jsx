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

import AdminLoginScreen from "../../AdminScreens/LoginScreen/LoginScreen";

describe("AdminLoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders heading, inputs and login button", () => {
    renderWithProviders(<AdminLoginScreen />);
    expect(screen.getByText("Prisijungimas")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/įveskite vartotojo vardą/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/įveskite slaptažodį/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /prisijungti/i })).toBeInTheDocument();
  });

  it("stores token and role then navigates on success", async () => {
    api.post.mockResolvedValue({ data: "token-abc" });
    renderWithProviders(<AdminLoginScreen />);

    fireEvent.change(screen.getByPlaceholderText(/įveskite vartotojo vardą/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/įveskite slaptažodį/i), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /prisijungti/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("token-abc");
      expect(localStorage.getItem("role")).toBe("admin");
      expect(mockNavigate).toHaveBeenCalledWith("/admin/landing");
    });
  });

  it("shows server error message on failed login", async () => {
    api.post.mockRejectedValue({
      response: { data: { message: "Neteisingi duomenys" } },
    });
    renderWithProviders(<AdminLoginScreen />);
    fireEvent.click(screen.getByRole("button", { name: /prisijungti/i }));
    await waitFor(() => {
      expect(screen.getByText("Neteisingi duomenys")).toBeInTheDocument();
    });
  });

  it("shows fallback error when response has no message", async () => {
    api.post.mockRejectedValue({ message: "Network Error" });
    renderWithProviders(<AdminLoginScreen />);
    fireEvent.click(screen.getByRole("button", { name: /prisijungti/i }));
    await waitFor(() => {
      expect(
        screen.getByText("Prisijungimas nepavyko. Bandykite dar kartą.")
      ).toBeInTheDocument();
    });
  });
});

