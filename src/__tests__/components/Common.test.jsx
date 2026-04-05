import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import LoadingSpinner from "../../Common/LoadingSpinner";
import QuestionView from "../../Common/QuestionView";

// ─── LoadingSpinner ───────────────────────────────────────────────────────────
describe("LoadingSpinner", () => {
  it("renders a spinner element", () => {
    renderWithProviders(<LoadingSpinner />);
    expect(document.querySelector(".chakra-spinner")).not.toBeNull();
  });

  it("is centered in a full-height container", () => {
    const { container } = renderWithProviders(<LoadingSpinner />);
    const box = container.firstChild;
    expect(box).toHaveStyle({ height: "100vh" });
  });
});

// ─── QuestionView ─────────────────────────────────────────────────────────────
const BASE_QUESTION = {
  id: "q1",
  text: "Koks yra 2+2?",
  points: 5,
  imageUrl: "",
  options: [],
  correctAnswers: ["4"],
  subQuestions: [],
  questionType: 1,
  textWithBlanks: "",
  maxCharsAllowed: null,
};

describe("QuestionView", () => {
  it("renders question text and points", () => {
    renderWithProviders(<QuestionView question={BASE_QUESTION} />);
    expect(screen.getByText("Koks yra 2+2?")).toBeInTheDocument();
    expect(screen.getByText(/Taškai: 5/)).toBeInTheDocument();
  });

  it("shows correct answers for open-ended question", () => {
    renderWithProviders(<QuestionView question={BASE_QUESTION} />);
    expect(screen.getByText("Teisingi atsakymai:")).toBeInTheDocument();
    expect(screen.getByText("- 4")).toBeInTheDocument();
  });

  it("shows options list and marks correct one", () => {
    const q = { ...BASE_QUESTION, options: ["A", "B", "C"], correctAnswers: ["A"] };
    renderWithProviders(<QuestionView question={q} />);
    expect(screen.getByText("Variantai:")).toBeInTheDocument();
    expect(screen.getByText("(Teisingas)")).toBeInTheDocument();
  });

  it("calls onRemove when Remove button is clicked", () => {
    const onRemove = jest.fn();
    renderWithProviders(<QuestionView question={BASE_QUESTION} onRemove={onRemove} />);
    screen.getByRole("button", { name: /pašalinti/i }).click();
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("does not show Remove button when onRemove is absent", () => {
    renderWithProviders(<QuestionView question={BASE_QUESTION} />);
    expect(screen.queryByRole("button", { name: /pašalinti/i })).toBeNull();
  });

  it("shows textWithBlanks section for type 4", () => {
    const q = { ...BASE_QUESTION, questionType: 4, textWithBlanks: "Lietuva yra [[]] šalis." };
    renderWithProviders(<QuestionView question={q} />);
    expect(screen.getByText("Tekstas su tuščiais laukais:")).toBeInTheDocument();
  });

  it("shows maxCharsAllowed when set", () => {
    const q = { ...BASE_QUESTION, maxCharsAllowed: 200 };
    renderWithProviders(<QuestionView question={q} />);
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("renders nested subquestions", () => {
    const q = {
      ...BASE_QUESTION,
      subQuestions: [{ ...BASE_QUESTION, id: "sq1", text: "Poklausimas", subQuestions: [] }],
    };
    renderWithProviders(<QuestionView question={q} />);
    expect(screen.getByText("Poklausimas")).toBeInTheDocument();
    expect(screen.getByText("Poklausimai:")).toBeInTheDocument();
  });
});

