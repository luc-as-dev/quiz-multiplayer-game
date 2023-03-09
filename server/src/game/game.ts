import {
  getQuestions,
  QuestionParamsType,
  QuestionType,
} from "../api/triviaAPI";
import { GameManager } from "./gameManager";
import { Question } from "./question";
import { User } from "./user";

const DEFAULT_TIME: number = 30;

export class Game {
  updatedAt: number;
  gameOn: boolean = false;
  id: string;
  owner: number = 0; // index of user in users
  users: User[] = [];
  time: number;
  questions: Question[] = null;
  currentQuestion: number = null;

  constructor(id: string, creator: User, time?: number) {
    this.id = id;
    this.users.push(creator);
    this.time = time || DEFAULT_TIME;
    this.updatedAt = Date.now();
  }

  start(): boolean {
    if (this.questions !== null) {
      this.gameOn = true;
      this.currentQuestion = 0;
      GameManager.startGame(this);
      this.updatedAt = Date.now();
      return true;
    }
    return false;
  }

  update() {}

  async fetchTriviaQuestions(questionParams: QuestionParamsType) {
    try {
      this.questions = [];
      const questions = await getQuestions(questionParams);
      questions.forEach((question: QuestionType) =>
        this.questions.push(
          new Question(
            this.time,
            question.category,
            question.difficulty,
            question.type,
            question.question,
            question.correct_answer,
            question.incorrect_answers
          )
        )
      );
      this.questions.forEach((question: Question) => {
        console.log(question.answers());
      });
      this.updatedAt = Date.now();
      return true;
    } catch (e) {
      return false;
    }
  }
}