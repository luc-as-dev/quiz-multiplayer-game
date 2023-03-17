import {
  ICategory,
  IDifficulty,
  ILibrary,
  IQuestion,
} from "../@types/QuizServer";
import QuestionLibrary from "./QuestionLibrary";

type LibraryType = {
  categories: ICategory[];
  difficulties: IDifficulty[];
  questions: IQuestion[];
};

export function memoryLibraryFromJSON(
  name: string,
  library: LibraryType
): MemoryLibrary {
  const lib = new MemoryLibrary(name);
  library.categories.forEach((c) => lib.addCategory(c));
  library.difficulties.forEach((d) => lib.addDifficulty(d));
  library.questions.forEach((q) => lib.addQuestion(q));
  return lib;
}

export default class MemoryLibrary extends QuestionLibrary {
  protected categories: ICategory[] = [];
  protected difficulties: IDifficulty[] = [];
  protected questions: IQuestion[] = [];

  public async addCategory(category: ICategory): Promise<boolean> {
    if (!this.categories.find((c) => c.name === category.name)) {
      this.categories.push(category);
      return true;
    }
    return false;
  }

  public async addDifficulty(difficulty: IDifficulty): Promise<boolean> {
    if (!this.difficulties.find((d) => d.name == difficulty.name)) {
      this.difficulties.push(difficulty);
      return true;
    }
    return false;
  }

  public async addQuestion(question: IQuestion): Promise<boolean> {
    if (!this.questions.find((q) => q.question === question.question)) {
      if (!this.categories.find((c) => c.name === question.category.name)) {
        console.log(
          `Category "${question.category}" does not exist in ${this.name}`
        );
        return false;
      }
      if (!this.difficulties.find((d) => d.name === question.difficulty.name)) {
        console.log(
          `Difficulty "${question.difficulty}" does not exist in ${this.name}`
        );
        return false;
      }
      this.questions.push(question);
      return true;
    }
    return false;
  }

  public async getCategories(): Promise<ICategory[]> {
    return this.categories;
  }

  public async getDifficulties(): Promise<IDifficulty[]> {
    return this.difficulties;
  }

  protected async getQuestions(
    limit?: number,
    category?: string,
    difficulty?: string
  ): Promise<IQuestion[]> {
    if (!limit) return this.questions;
    let questionsCopy = [...this.questions];
    if (category)
      questionsCopy = questionsCopy.filter((q) => q.category.name === category);
    if (difficulty)
      questionsCopy = questionsCopy.filter(
        (q) => q.difficulty.name === difficulty
      );
    if (questionsCopy.length < limit) limit = questionsCopy.length;

    const questions = [];
    for (let i = 0; i < limit; i++) {
      const index = Math.floor(Math.random() * (limit - i));
      const question: IQuestion = questionsCopy.splice(index, 1)[0];
      questions.push(question);
    }
    return questions;
  }

  public async getQuestionsLength(): Promise<number> {
    return this.questions.length;
  }
}
