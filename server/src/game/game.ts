import { StageType } from "../@types/QuizServer";
import { GameManager } from "./GameManager";
import { Question } from "./Question";
import { User } from "./User";

const DEFAULT_TIME: number = 30;
const TIMEOUT_TIME: number = 10;

const EXAMPLE_QUESTIONS = [
  new Question(
    30,
    "Exempel frågor",
    "easy",
    "boolean",
    "Tycker du om Quiz?",
    "Ja",
    ["Nej", "Oklart", "Vet inte"]
  ),
  new Question(
    30,
    "Exempel frågor",
    "easy",
    "boolean",
    "Fungerar detta?",
    "Ja",
    ["Nej", "Oklart", "Vet inte"]
  ),
];

export class Game {
  manager: GameManager;

  id: string;
  owner: number = 0; // index of user in users
  updatedAt: number;
  time: number;
  gameOn: boolean = false;
  stage: StageType;

  users: User[] = [];
  lastPing: { [username: string]: number } = {};
  answers: { [username: string]: string } = {};

  currentTime: number | null = null;
  currentQuestion: number | null = null;
  questions: Question[] = null;

  constructor(manager: GameManager, id: string, creator: User, time?: number) {
    this.manager = manager;

    this.id = id;
    this.users.push(creator);
    this.time = time || DEFAULT_TIME;
    this.stage = "lobby";
    this.updatedAt = Date.now();
  }

  public ping(user: User): number {
    this.lastPing[user.getName()] = Date.now();
    return this.updatedAt;
  }

  public saveAnswer(username: string, answer: string) {
    this.answers[username] = answer;
  }

  public getQuestion(): {} | null {
    if (this.questions) {
      const question = this.questions[this.currentQuestion];

      return {
        time: question.time,
        category: question.category,
        difficulty: question.difficulty,
        type: question.type,
        question: question.question,
        answers: question.getAnswers(),
      };
    }
    return null;
  }

  public addUser(user: User): void {
    this.users.push(user);
    this.ping(user);
    this.updatedAt = Date.now();
  }

  public removeUser(username: string): void {
    console.log(`Game[${this.id}]: Removing ${username}`);
    this.users = this.users.filter((user: User) => user.getName() !== username);
    delete this.lastPing[username];
    delete this.answers[username];
    this.updatedAt = Date.now();

    if (this.users.length === 0) {
      this.manager.removeGame(this);
    }
  }

  public isOwner(user: User): boolean {
    return this.getOwner() === user;
  }

  public findUserByName(name: string): User | undefined {
    return this.users.find((user) => user.getName() === name);
  }

  public getPlayers(): { [username: string]: number } {
    const players: { [username: string]: number } = {};

    this.users.forEach(
      (user: User) => (players[user.getName()] = user.getScore())
    );

    return players;
  }

  public getOwner(): User {
    return this.users[this.owner];
  }

  private setStage(stage: StageType): void {
    this.stage = stage;
    this.updatedAt = Date.now();
  }

  public start() {
    this.questions = EXAMPLE_QUESTIONS;
    this.currentQuestion = 0;
    this.setStage(this.currentQuestion);
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
          this.answers[username] ===
          this.questions[this.currentQuestion].correct_answer
        ) {
          // Add points
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
