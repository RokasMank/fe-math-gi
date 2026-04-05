import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";

jest.mock("../../apiClient");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

import LandingScreen from "../../AdminScreens/LandingScreen/LandingScreen";

describe("LandingScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the welcome heading", () => {
    renderWithProviders(<LandingScreen />);
    expect(screen.getByText("Sveiki atvykę į sistemą")).toBeInTheDocument();
  });

  it("renders all 6 navigation buttons", () => {
    renderWithProviders(<LandingScreen />);
    expect(screen.getByRole("button", { name: /sukurti administratorių/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tvarkyti mokinius/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sukurti testą/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /visi testai/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sukurti testo priskyrimą/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /peržiūrėti testo priskyrimus/i })).toBeInTheDocument();
  });

  it("navigates to /admin/create", () => {
    renderWithProviders(<LandingScreen />);
    fireEvent.click(screen.getByRole("button", { name: /sukurti administratorių/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/create");
  });

  it("navigates to /admin/manage-students", () => {
    renderWithProviders(<LandingScreen />);
    fireEvent.click(screen.getByRole("button", { name: /tvarkyti mokinius/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/manage-students");
  });

  it("navigates to /admin/create-test", () => {
    renderWithProviders(<LandingScreen />);
    fireEvent.click(screen.getByRole("button", { name: /sukurti testą/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/create-test");
  });

  it("navigates to /admin/all-tests", () => {
    renderWithProviders(<LandingScreen />);
    fireEvent.click(screen.getByRole("button", { name: /visi testai/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/all-tests");
  });

  it("navigates to /admin/create-assignment", () => {
    renderWithProviders(<LandingScreen />);
    fireEvent.click(screen.getByRole("button", { name: /sukurti testo priskyrimą/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/create-assignment");
  });

  it("navigates to /admin/view-assignments", () => {
    renderWithProviders(<LandingScreen />);
    fireEvent.click(screen.getByRole("button", { name: /peržiūrėti testo priskyrimus/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/view-assignments");
  });
});

