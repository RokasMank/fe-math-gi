import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";

jest.mock("../../apiClient");
import api from "../../apiClient";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "session-1" }),
  useLocation: () => ({ state: { testId: "test-1" } }),
  useNavigate: () => jest.fn(),
}));

import StudentTestPage from "../../StudentScreens/MainScreen/StudentTestPage";

const MOCK_TEST = {
  id: "test-1",
  title: "Algebros testas",
  questions: [
    {
      id: "q1",
      text: "Koks yra 2+2?",
      questionType: 1,
      points: 5,
      options: [],
      correctAnswers: ["4"],
      subQuestions: [],
      imageUrl: "",
      textWithBlanks: "",
      maxCharsAllowed: null,
    },
    {
      id: "q2",
      text: "Koks yra 3+3?",
      questionType: 1,
      points: 3,
      options: [],
      correctAnswers: ["6"],
      subQuestions: [],
      imageUrl: "",
      textWithBlanks: "",
      maxCharsAllowed: null,
    },
  ],
};

describe("StudentTestPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => jest.useRealTimers());

  it("shows a spinner while loading", () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<StudentTestPage />);
    expect(document.querySelector(".chakra-spinner")).not.toBeNull();
  });

  it("renders test title and first question after load", async () => {
    api.get.mockResolvedValue({ data: MOCK_TEST });
    renderWithProviders(<StudentTestPage />);
    await waitFor(() => {
      expect(screen.getByText("Algebros testas")).toBeInTheDocument();
      expect(screen.getByText("Koks yra 2+2?")).toBeInTheDocument();
    });
  });

  it("shows question counter (1 iš 2)", async () => {
    api.get.mockResolvedValue({ data: MOCK_TEST });
    renderWithProviders(<StudentTestPage />);
    await waitFor(() => {
      expect(screen.getByText(/klausimas 1 iš 2/i)).toBeInTheDocument();
    });
  });

  it("shows countdown timer starting at 45:00", async () => {
    api.get.mockResolvedValue({ data: MOCK_TEST });
    renderWithProviders(<StudentTestPage />);
    await waitFor(() => {
      expect(screen.getByText(/45:00/)).toBeInTheDocument();
    });
  });

  it("previous button is disabled on the first question", async () => {
    api.get.mockResolvedValue({ data: MOCK_TEST });
    renderWithProviders(<StudentTestPage />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /ankstesnis/i })).toBeDisabled();
    });
  });

  it("shows 'Baigti testą' when only one question exists", async () => {
    api.get.mockResolvedValue({ data: { ...MOCK_TEST, questions: [MOCK_TEST.questions[0]] } });
    renderWithProviders(<StudentTestPage />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /baigti testą/i })).toBeInTheDocument();
    });
  });

  it("shows 'Kitas' when there are more questions", async () => {
    api.get.mockResolvedValue({ data: MOCK_TEST });
    renderWithProviders(<StudentTestPage />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /kitas/i })).toBeInTheDocument();
    });
  });
});

