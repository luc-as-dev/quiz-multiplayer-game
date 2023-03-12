export class Question {
  time: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  type: "boolean" | "multiple";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];

  constructor(
    time: number,
    category: string,
    difficulty: "easy" | "medium" | "hard",
    type: "boolean" | "multiple",
    question: string,
    correct_answer: string,
    incorrect_answers: string[]
  ) {
    this.time = time;
    this.category = category;
    this.difficulty = difficulty;
    this.type = type;
    this.question = question;
    this.correct_answer = correct_answer;
    this.incorrect_answers = incorrect_answers;
  }

  getAnswers(): string[] {
    const answers = [this.correct_answer, ...this.incorrect_answers];
    answers.sort(() => (Math.random() > 0.5 ? 1 : -1));
    return answers;
  }
}
