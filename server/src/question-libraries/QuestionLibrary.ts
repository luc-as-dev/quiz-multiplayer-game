import {
  ICategory,
  IDifficulty,
  IQuestion,
  ISafeQuestion,
} from "../@types/QuizServer";

export default class QuestionLibrary {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  public async addCategory(category: ICategory): Promise<boolean> {
    return false;
  }

  public async addDifficulty(difficulty: IDifficulty): Promise<boolean> {
    return false;
  }

  public async addQuestion(question: IQuestion): Promise<boolean> {
    return false;
  }

  public async getCategories(): Promise<ICategory[]> {
    return [];
  }

  public async getDifficulties(): Promise<IDifficulty[]> {
    return [];
  }

  protected async getQuestions(
    limit: number,
    category?: ICategory["name"],
    difficulty?: IDifficulty["name"]
  ): Promise<IQuestion[]> {
    return [];
  }

  public async getSafeQuestions(
    limit: number,
    category?: ICategory["name"],
    difficulty?: IDifficulty["name"]
  ): Promise<{ questions: ISafeQuestion[]; correctAnswers: string[] }> {
    // Merge correctAnswer and incorrectAnswers to answers to avoid cheating/hacks

    const safeQuestions: ISafeQuestion[] = [];
    const correctAnswers: string[] = [];
    const questions = await this.getQuestions(limit, category, difficulty);

    questions.forEach((q) => {
      const { correctAnswer, incorrectAnswers, ...rest } = q;
      const answers = [correctAnswer, ...incorrectAnswers];
      answers.sort(() => (Math.random() > 0.5 ? 1 : -1));
      safeQuestions.push({ ...rest, answers });
      correctAnswers.push(correctAnswer);
    });
    return { questions: safeQuestions, correctAnswers };
  }
}
