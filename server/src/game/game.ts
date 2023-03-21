import { ISafeQuestion, IUser, StageType } from "../@types/QuizServer";
import GameManager from "./gameManager";

const DEFAULT_TIME: number = 30;
const TIMEOUT_TIME: number = 10;
const BASE_SCORE = 100;

export default class Game {
  manager: GameManager;

  id: string;
  owner: number = 0; // index of user in users
  updatedAt: number;
  time: number;
  gameOn: boolean = false;
  stage: StageType;

  users: IUser[] = [];
  lastPing: { [username: string]: number } = {};
  answers: { [username: string]: string } = {};

  currentTime: number | null = null;
  currentQuestion: number | null = null;
  questions: ISafeQuestion[] = null;
  correctAnswers: string[] = null;

  constructor(manager: GameManager, id: string, creator: IUser, time?: number) {
    this.manager = manager;

    this.id = id;
    this.users.push(creator);
    this.time = time || DEFAULT_TIME;
    this.stage = "lobby";
    this.updatedAt = Date.now();
  }

  public ping(user: IUser): number {
    this.lastPing[user.name] = Date.now();
    return this.updatedAt;
  }

  public saveAnswer(username: string, answer: string) {
    this.answers[username] = answer;
  }

  public getQuestion(): ISafeQuestion | null {
    if (this.questions) {
      return this.questions[this.currentQuestion];
    }
    return null;
  }

  public addUser(user: IUser): void {
    this.users.push(user);
    this.ping(user);
    this.updatedAt = Date.now();
  }

  public removeUser(username: string): void {
    console.log(`Game[${this.id}]: Removing ${username}`);
    this.users = this.users.filter((user: IUser) => user.name !== username);
    delete this.lastPing[username];
    delete this.answers[username];
    this.updatedAt = Date.now();

    if (this.users.length === 0) {
      this.manager.removeGame(this);
    }
  }

  public isOwner(user: IUser): boolean {
    return this.getOwner().name === user.name;
  }

  public findUserByName(name: string): IUser | undefined {
    return this.users.find((user) => user.name === name);
  }

  public getPlayers(): { [username: string]: number } {
    const players: { [username: string]: number } = {};

    this.users.forEach((user: IUser) => (players[user.name] = user.score));

    return players;
  }

  public getOwner(): IUser {
    return this.users[this.owner];
  }

  private setStage(stage: StageType): void {
    this.stage = stage;
    this.updatedAt = Date.now();
  }

  public async start(
    libraryName: string,
    category: string,
    difficulty: string
  ): Promise<boolean> {
    const library = this.manager.findLibraryByName(libraryName);
    const { questions, correctAnswers } = await library.getSafeQuestions(
      10,
      category,
      difficulty
    );
    if (questions && questions.length > 0) {
      this.questions = questions;
      this.correctAnswers = correctAnswers;
      this.currentQuestion = 0;
      this.setStage(this.currentQuestion);
      return true;
    }
    this.setStage("end");
    return false;
  }

  private nextQuestion() {
    this.currentQuestion++;
    this.setStage(this.currentQuestion);
  }

  private finnish() {
    this.setStage("end");
  }

  private updatePing() {
    const now: number = Date.now();
    Object.keys(this.lastPing).forEach((username: string) => {
      if ((now - this.lastPing[username]) / 1000 > TIMEOUT_TIME) {
        this.removeUser(username);
      }
    });
  }

  private updateAnswer() {
    // Check if all players have answered.
    if (Object.keys(this.answers).length === Object.keys(this.users).length) {
      Object.keys(this.answers).forEach((username: string) => {
        if (
          this.answers[username] === this.correctAnswers[this.currentQuestion]
        ) {
          this.findUserByName(username).score += BASE_SCORE;
        }
        delete this.answers[username];
      });
      if (this.currentQuestion === this.questions.length - 1) {
        this.finnish();
      } else {
        this.nextQuestion();
      }
    }
  }

  public update() {
    this.updatePing();

    if (this.stage.toString() === "lobby") {
    } else if (this.stage.toString() === "end") {
    } else {
      this.updateAnswer();
    }
  }
}
