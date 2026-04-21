/**
 * The default (blank) shape for a new question.
 * Spread this object when resetting form state to avoid shared references.
 *
 * Usage:
 *   const [question, setQuestion] = useState({ ...DEFAULT_QUESTION });
 *   setQuestion({ ...DEFAULT_QUESTION }); // reset
 */
export const DEFAULT_QUESTION = Object.freeze({
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
  contentType: "NumbersAndCalculations",
  achievementArea: "KnowledgeUnderstandingArgumentation",
});
