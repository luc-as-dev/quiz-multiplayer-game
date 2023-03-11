import {
  getQuestions,
  QuestionParamsType,
  QuestionType,
} from "../api/triviaAPI";
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
  stage: "lobby" | number | "end";

  constructor(id: string, creator: User, time?: number) {
    this.id = id;
    this.users.push(creator);
    this.time = time || DEFAULT_TIME;
    this.stage = "lobby";
    this.updatedAt = Date.now();
  }

  private setStage(stage: "lobby" | number | "end"): void {
    this.stage = stage;
    this.updatedAt = Date.now();
  }

  public findUserByName(name: string): User | undefined {
    return this.users.find((user) => user.getName() === name);
  }

  public addUser(user: User): void {
    this.users.push(user);
    this.updatedAt = Date.now();
  }

  public isOwner(user: User): boolean {
    return this.users[this.owner] === user;
  }

  public getPlayers(): { [username: string]: number } {
    const players: { [username: string]: number } = {};

    this.users.forEach(
      (user: User) => (players[user.getName()] = user.getScore())
    );

    return players;
  }

  public start(): void {
    this.currentQuestion = this.currentQuestion ? this.currentQuestion + 1 : 1;
    this.setStage(this.currentQuestion);
  }

  public update() {}

  public async fetchTriviaQuestions(questionParams: QuestionParamsType) {
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
