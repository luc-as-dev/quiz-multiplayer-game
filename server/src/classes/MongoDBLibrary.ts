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
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  difficulty: {
    type: mongoose.Types.ObjectId,
    ref: "Difficulty",
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
      const categoryId = (
        await this.Category.findOne({ name: question.category.name })
      )._id;
      if (!categoryId) {
        console.log(
          `Category "${question.category}" does not exist in ${this.name}`
        );
        return false;
      }

      const difficultyId = (
        await this.Difficulty.findOne({ name: question.difficulty.name })
      )._id;
      if (!difficultyId) {
        console.log(
          `Difficulty "${question.difficulty}" does not exist in ${this.name}`
        );
        return false;
      }

      await this.Question.create({
        ...question,
        category: categoryId,
        difficulty: difficultyId,
      });
      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  public async getCategories(): Promise<ICategory[]> {
    const categories = await this.Category.find();
    console.log(categories);
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
    return await this.Question.find({ category, difficulty }).limit(limit);
  }

  public async getQuestionLength(): Promise<number> {
    return await this.Question.count();
  }
}
