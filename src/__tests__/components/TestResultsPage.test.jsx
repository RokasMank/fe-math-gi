import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";

jest.mock("../../apiClient");
import api from "../../apiClient";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "session-42" }),
}));

import TestResultsPage from "../../StudentScreens/MainScreen/TestResultsPage";

const MOCK_RESULTS = {
  title: "Algebros testas rezultatai",
  scoreEarned: 8,
  totalScore: 10,
  results: [
    {
      question: { id: "q1", text: "Koks yra 2+2?", options: [], correctAnswers: ["4"] },
      providedAnswers: ["4"],
      isCorrect: true,
      subResults: [],
    },
    {
      question: { id: "q2", text: "Koks yra 10/2?", options: [], correctAnswers: ["5"] },
      providedAnswers: ["3"],
      isCorrect: false,
      subResults: [],
    },
  ],
};

describe("TestResultsPage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows a spinner while loading", () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<TestResultsPage />);
    expect(document.querySelector(".chakra-spinner")).not.toBeNull();
  });

  it("renders title and score after load", async () => {
    api.get.mockResolvedValue({ data: MOCK_RESULTS });
    renderWithProviders(<TestResultsPage />);
    await waitFor(() => {
      expect(screen.getByText("Algebros testas rezultatai")).toBeInTheDocument();
      expect(screen.getByText(/taškai: 8\/10/i)).toBeInTheDocument();
    });
  });

  it("renders all question texts", async () => {
    api.get.mockResolvedValue({ data: MOCK_RESULTS });
    renderWithProviders(<TestResultsPage />);
    await waitFor(() => {
      expect(screen.getByText(/koks yra 2\+2/i)).toBeInTheDocument();
      expect(screen.getByText(/koks yra 10\/2/i)).toBeInTheDocument();
    });
  });

  it("shows Teisingai for a correct answer", async () => {
    api.get.mockResolvedValue({ data: MOCK_RESULTS });
    renderWithProviders(<TestResultsPage />);
    await waitFor(() => expect(screen.getByText("Teisingai")).toBeInTheDocument());
  });

  it("shows Neteisingai for an incorrect answer", async () => {
    api.get.mockResolvedValue({ data: MOCK_RESULTS });
    renderWithProviders(<TestResultsPage />);
    await waitFor(() => expect(screen.getByText("Neteisingai")).toBeInTheDocument());
  });

  it("shows empty-state message when results are null", async () => {
    api.get.mockResolvedValue({ data: null });
    renderWithProviders(<TestResultsPage />);
    await waitFor(() => {
      expect(screen.getByText("Rezultatų nerasta.")).toBeInTheDocument();
    });
  });

  it("shows provided and correct answers labels", async () => {
    api.get.mockResolvedValue({ data: MOCK_RESULTS });
    renderWithProviders(<TestResultsPage />);
    await waitFor(() => {
      expect(screen.getAllByText(/pateikti atsakymai/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/teisingi atsakymai/i).length).toBeGreaterThan(0);
    });
  });
});

