import mongoose, { Connection, Model } from "mongoose";
import { ICategory, IDifficulty, IQuestion } from "../@types/QuizServer";
import QuestionLibrary from "./QuestionLibrary";

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
});

const difficultySchema = new mongoose.Schema<IDifficulty>({
  name: {
    type: String,
    required: true,
  },
  multiplier: {
    type: Number,
    required: true,
  },
});

const questionSchema = new mongoose.Schema<IQuestion>({
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  incorrectAnswers: {
    type: [String],
    required: true,
  },
});

export default class MongoDBLibrary extends QuestionLibrary {
  protected connection: Connection;
  protected Category: Model<ICategory>;
  protected Difficulty: Model<IDifficulty>;
  protected Question: Model<IQuestion>;

  constructor(name: string, uri: string) {
    super(name);
    this.connection = mongoose.createConnection(uri);
    console.log(`Library: [${this.name}] - Connected to MongoDB`);

    this.Category = this.connection.model<ICategory>(
      "Category",
      categorySchema
    );
    this.Difficulty = this.connection.model<IDifficulty>(
      "Difficulty",
      difficultySchema
    );
    this.Question = this.connection.model<IQuestion>(
      "Question",
      questionSchema
    );
  }

  public async addCategory(category: ICategory): Promise<boolean> {
    try {
      await this.Category.create(category);
      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  public async addDifficulty(difficulty: IDifficulty): Promise<boolean> {
    try {
      await this.Difficulty.create(difficulty);
      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  public async addQuestion(question: IQuestion): Promise<boolean> {
    try {
      await this.Question.create(question);
      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  public async getCategories(): Promise<ICategory[]> {
    const categories = await this.Category.find();
    return categories;
  }

  public async getDifficulties(): Promise<IDifficulty[]> {
    return await this.Difficulty.find();
  }

  protected async getQuestions(
    limit: number,
    category?: string,
    difficulty?: string
  ): Promise<IQuestion[]> {
    console.log("Getting Questions");

    const filter = { category: category, difficulty: difficulty };
    if (!category) delete filter.category;
    if (!difficulty) delete filter.difficulty;

    const questionsRaw = await this.Question.find(filter).limit(limit).lean();

    return questionsRaw.map((q) => ({
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      correctAnswer: q.correctAnswer,
      incorrectAnswers: q.incorrectAnswers,
    }));
  }

  public async getQuestionLength(): Promise<number> {
    return await this.Question.count();
  }
}
