import { Server } from "socket.io";
import {
  ICategory,
  IDifficulty,
  ISafeQuestion,
  ISession,
  ISessionInfo,
  ScoreboardType,
  SessionNamespace,
  SessionSocket,
  StageType,
} from "../@types/QuizServer";
import QuestionLibrary from "./QuestionLibrary";

const TIME_OUT_S = 5000;
const OWNER_ROOM = "owner";
const LIMIT = 3;
const QUESTION_POINT = 100;
const QUESTION_TIME_S = 15;
const MIDDLE_TIME_S = 3;
const QUESTION_DELAY_MS = 500;

type Params = {
  io: Server;
  libraries: QuestionLibrary[];
  nspPrefix: string;
  id: string;
  username: string;
  onDelete: () => void;
};

export default class GameSession {
  public sessionNSP: SessionNamespace;
  public id: string;

  public owner: string = undefined;
  public users: { [username: string]: number } = {}; // user id -> score
  public scoreboard?: ScoreboardType;
  public timeouts: { [username: string]: NodeJS.Timeout } = {};

  public stage: StageType = "lobby";

  private libraries: QuestionLibrary[];
  private selectedLibrary: number = null;
  private categories: ICategory[] = null;
  private selectedCategory: number = null;
  private difficulties: IDifficulty[] = null;
  private selectedDifficulty: number = null;

  private questions: ISafeQuestion[];
  private currentQuestion: number;
  private correctAnswers: string[];
  private answers: { [username: string]: string };

  private questionTimeS: number = QUESTION_TIME_S;
  private middleTimeS: number = MIDDLE_TIME_S;
  private stageTimeout: NodeJS.Timeout = null;

  private onDelete: () => void;

  constructor(params: Params) {
    this.sessionNSP = params.io.of(params.nspPrefix + params.id);
    this.libraries = params.libraries;
    this.id = params.id;
    this.owner = params.username;
    this.users[params.username] = 0;

    this.setupNSP();
    this.onDelete = params.onDelete;

    this.setLibrary(this.libraries[0].name).then((success) => {
      if (success) {
        this.setCategory(this.categories[0].name);
        this.setDifficulty(this.difficulties[0].name);
      }
    });
  }

  public getSessionInfo(): ISessionInfo {
    const sessionInfo: ISessionInfo = {
      id: this.id,
      owner: this.owner,
      users: Object.keys(this.users),
    };
    return sessionInfo;
  }

  private getSession(username: string): ISession {
    return {
      id: this.id,
      username: username,
      isOwner: this.owner === username,
      users: this.users,
      question: null,
      updatedAt: Date.now(), // to be removed
      stage: this.stage,
      questionTime: this.questionTimeS,
      middleTime: this.middleTimeS,
      library: this.libraries[this.selectedLibrary].name,
      category: this.categories
        ? this.categories[this.selectedCategory].name
        : undefined,
      difficulty: this.difficulties
        ? this.difficulties[this.selectedDifficulty].name
        : undefined,
      scoreboard: this.scoreboard,
    };
  }

  private sendLibraryInfo(): void {
    this.sessionNSP.to(OWNER_ROOM).emit(
      "libraries",
      this.libraries.map((l) => l.name)
    );
    this.sessionNSP.to(OWNER_ROOM).emit(
      "categories",
      this.categories.map((c) => c.name)
    );
    this.sessionNSP.to(OWNER_ROOM).emit(
      "difficulties",
      this.difficulties.map((d) => d.name)
    );
  }

  private sendOwnerInfo(): void {
    console.log("Sending owner info");
    this.sendLibraryInfo();
  }

  private async setLibrary(name: string): Promise<boolean> {
    let index: number;
    this.libraries.find((l, i) => ((index = i), l.name) === name);
    if (index !== -1) {
      const library = this.libraries[index];

      this.selectedLibrary = index;
      this.categories = await library.getCategories();
      this.difficulties = await library.getDifficulties();

      this.setCategory(this.categories[0].name);
      this.setDifficulty(this.difficulties[0].name);

      this.sessionNSP.emit("set-library", library.name);
      this.sendLibraryInfo();
      return true;
    }
    return false;
  }

  private setCategory(name: string): boolean {
    let index: number;
    this.categories.find((c, i) => ((index = i), c.name) === name);
    if (index !== -1) {
      const category = this.categories[index];
      this.selectedCategory = index;
      this.sessionNSP.emit("set-category", category.name);
      return true;
    }
    return false;
  }

  private setDifficulty(name: string): boolean {
    let index: number;
    this.difficulties.find((d, i) => ((index = i), d.name) === name);
    if (index !== -1) {
      const difficulty = this.difficulties[index];
      this.selectedDifficulty = index;
      this.sessionNSP.emit("set-difficulty", difficulty.name);
      return true;
    }
    return false;
  }

  private async joinSession(socket: SessionSocket, username: string) {
    if (!this.users[username]) {
      console.log("Adding user " + username + " to " + this.id);
      this.users[username] = 0;
      if (Object.keys(this.users).length !== 0) {
        this.sessionNSP.emit("add-user", username);
      }
      if (this.owner === username) {
        console.log("Is owner");
        this.setupOwner(socket);
      }
    }

    socket.on("send-answer", (answer) => this.answer(username, answer));

    socket.on("leave-session", () => {
      console.log("Client " + username + " left session " + this.id);
      this.leaveSession(socket, username);
    });

    socket.emit("session", this.getSession(username));
  }

  private deleteSession() {
    console.log("Deleting session " + this.id);
    this.onDelete();
  }

  private leaveSession(socket: SessionSocket, username: string) {
    console.log("Removing user " + username + " from " + this.id);
    socket.removeAllListeners();

    if (this.answers && this.answers[username]) delete this.answers[username];
    delete this.users[username];

    if (Object.keys(this.users).length === 0) {
      this.deleteSession();
    } else {
      // TODO: Check if owner left
      this.sessionNSP.emit("remove-user", username);
    }
  }

  private checkAnswers(): void {
    const multiplier = this.difficulties[this.selectedDifficulty].multiplier;
    const correctAnswer = this.correctAnswers[this.currentQuestion];
    Object.keys(this.users).forEach((username) => {
      if (this.answers[username] === correctAnswer) {
        this.users[username] += QUESTION_POINT * multiplier;
      }
    });
    this.answers = {};
  }

  private toLobbyStage(): void {
    this.stage = "lobby";

    this.sessionNSP.emit("set-stage-lobby");
  }

  private toQuestionStage(): void {
    this.stage = "question";
    this.questions[this.currentQuestion];

    this.sessionNSP.emit(
      "set-stage-question",
      this.questions[this.currentQuestion]
    );

    this.stageTimeout = setTimeout(
      () => this.nextStage(),
      this.questionTimeS * 1000
    );
  }

  private toMiddleStage(): void {
    this.stage = "middle";
    this.sessionNSP.emit("set-stage-middle", this.users);

    this.stageTimeout = setTimeout(
      () => this.nextStage(),
      this.middleTimeS * 1000
    );
  }

  private toEndStage(): void {
    this.stage = "end";

    const scoreboard: ScoreboardType = [];

    Object.keys(this.users).forEach((username) => {
      scoreboard.push({
        username: username,
        score: this.users[username],
      });
    });

    this.scoreboard = scoreboard.sort((a, b) => b.score - a.score);
    this.sessionNSP.emit("set-stage-end", this.scoreboard);
  }

  private nextStage(): void {
    clearTimeout(this.stageTimeout);
    if (this.stage === "question") {
      this.checkAnswers();
      this.currentQuestion++;
      if (this.currentQuestion === this.questions.length) {
        setTimeout(() => this.toEndStage(), QUESTION_DELAY_MS);
      } else {
        setTimeout(() => this.toMiddleStage(), QUESTION_DELAY_MS);
      }
    } else {
      this.toQuestionStage();
    }
  }

  private answer(username: string, answer: string): void {
    this.answers[username] = answer;
    if (Object.keys(this.answers).length === Object.keys(this.users).length) {
      this.nextStage();
    }
  }

  private async startSession() {
    console.log("Starting session " + this.id);

    const library = this.libraries[this.selectedLibrary];
    const { questions, correctAnswers } = await library.getSafeQuestions(
      LIMIT,
      this.categories[this.selectedCategory].name,
      this.difficulties[this.selectedDifficulty].name
    );

    this.currentQuestion = 0;
    this.questions = questions;
    this.answers = {};
    this.correctAnswers = correctAnswers;

    this.toMiddleStage();
  }

  private resetSession(): void {
    this.currentQuestion = undefined;
    this.questions = undefined;
    this.answers = undefined;
    this.correctAnswers = undefined;

    this.toLobbyStage();
  }

  private setupOwner(socket: SessionSocket): void {
    socket.join(OWNER_ROOM);
    socket.on("get-owner-info", () => this.sendOwnerInfo());
    socket.on("set-library", (name: string) => this.setLibrary(name));
    socket.on("set-category", (name: string) => this.setCategory(name));
    socket.on("set-difficulty", (name: string) => this.setDifficulty(name));
    socket.on("start-session", () => this.startSession());
    socket.on("reset-session", () => this.resetSession());
  }

  private setupNSP() {
    this.sessionNSP.on("connection", (socket: SessionSocket) => {
      console.log("Connection from " + socket.id);

      socket.on("join-session", (username: string) => {
        console.log("Client " + username + " joined session " + this.id);
        this.joinSession(socket, username);

        if (this.timeouts[username]) {
          clearTimeout(this.timeouts[username]);
          delete this.timeouts[username];
        }

        socket.on("disconnect", () => {
          console.log("Client " + socket.id + " disconnected");
          this.timeouts[username] = setTimeout(() => {
            this.leaveSession(socket, username);
          }, TIME_OUT_S * 1000);
        });
      });
    });
  }
}
