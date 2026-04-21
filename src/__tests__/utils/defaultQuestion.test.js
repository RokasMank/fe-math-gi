import { DEFAULT_QUESTION } from "../../utils/defaultQuestion";

describe("DEFAULT_QUESTION", () => {
  it("has all required fields with correct defaults", () => {
    expect(DEFAULT_QUESTION).toMatchObject({
      text: "",
      points: "",
      questionType: "",
      options: [],
      correctAnswers: [],
      imageUrl: "",
      subQuestions: [],
      setMaxChars: false,
      maxCharsAllowed: null,
      textWithBlanks: "",
      questionCategoryClass: "CatOne",
      contentType: "NumbersAndCalculations",
      achievementArea: "KnowledgeUnderstandingArgumentation",
    });
  });

  it("arrays are empty by default", () => {
    expect(DEFAULT_QUESTION.options).toHaveLength(0);
    expect(DEFAULT_QUESTION.correctAnswers).toHaveLength(0);
    expect(DEFAULT_QUESTION.subQuestions).toHaveLength(0);
  });

  it("spreading produces independent copies", () => {
    const copy1 = { ...DEFAULT_QUESTION };
    const copy2 = { ...DEFAULT_QUESTION };
    copy1.text = "changed";
    expect(copy2.text).toBe("");
  });
});
