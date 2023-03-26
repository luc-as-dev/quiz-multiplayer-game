import { io } from "socket.io-client";
import {
  DefaultSocket,
  ILocals,
  ISession,
  ISessionInfo,
  ISessionInfos,
  SessionSocket,
} from "../@types/QuizClient";

const DEFAULT_NSP = "/quiz-mp";
const SESSION_NSP_PREFIX = "/quiz-mp-session-";
const TIME_UPDATE_MS = 1000;

const LOCAL_STORAGE_KEY = "quiz";
type LOCAL_STORAGE_TYPE = { id: string; username: string };

type Params = {
  serverURL: string;
  setLocals?: (locals: ILocals) => void;
  setSession?: (session: ISession | null) => void;
  setSearchSessions?: (sessionInfos: ISessionInfos) => void;
  localStorageKey?: string;
  defaultNSP?: string;
  sessionNSP?: string;
};

export class QuizSocketClient {
  private defaultSocket?: DefaultSocket;
  private sessionNSPPrefix?: string;
  private sessionSocket: SessionSocket | null = null;
  private localStorageKey: string = LOCAL_STORAGE_KEY;

  private timeInterval: number | null = null;

  private locals: ILocals = {} as ILocals;
  private setLocalsCallback?: (locals: ILocals) => void;

  private session: ISession | null = null;
  private setSessionCallback?: (session: ISession | null) => void;

  private availableSessions: ISessionInfos = {};
  private setAvailableSessionCallback?: (sessionsInfos: ISessionInfos) => void;

  public getSession = () => ({ ...this.session });
  public getSessionSearch = () => ({ ...this.availableSessions });

  public hasSession = () => !!this.session;

  public start(params: Params) {
    this.sessionNSPPrefix =
      params.serverURL + (params.sessionNSP || SESSION_NSP_PREFIX);

    this.setLocalsCallback = params.setLocals;
    this.setSessionCallback = params.setSession;
    this.setAvailableSessionCallback = params.setSearchSessions;

    this.defaultSocket = io(
      params.serverURL + (params.defaultNSP || DEFAULT_NSP)
    );
    this.setupEventListeners();

    if (params.localStorageKey) this.localStorageKey = params.localStorageKey;

    const localStorage = this.getLocalStorage();
    if (localStorage) {
      this.joinSession(localStorage.id, localStorage.username);
      // TODO check success, else clear local storage
    }
  }

  public setLibrary(name: string): void {
    this.sessionSocket!.emit("set-library", name);
  }

  public setCategory(name: string): void {
    this.sessionSocket!.emit("set-category", name);
  }

  public setDifficulty(name: string): void {
    this.sessionSocket!.emit("set-difficulty", name);
  }

  public createSession(id: string, username: string): void {
    if (!this.defaultSocket) return;
    console.log("Creating new session");
    this.defaultSocket.emit("create-session", { id, username });
    this.defaultSocket.once("session-created", () => {
      console.log("Session created");
      this.joinSession(id, username);
    });
  }

  public joinSession(id: string, username: string): void {
    this.sessionSocket = io(this.sessionNSPPrefix + id);
    this.sessionSocket.on("connect", () => {
      console.log("Connecting to session");
      this.sessionSocket!.emit("join-session", username);

      this.sessionSocket!.once("session", (session: ISession) => {
        console.log("Received session", session);
        this.setSession({ ...session });

        this.saveLocalStorage();

        if (session.isOwner) {
          this.sessionSocket!.emit("get-owner-info");
          this.sessionSocket!.on("libraries", (libraries: string[]) => {
            console.log("libraries", libraries);
            this.updateSession({ libraries });
          });

          this.sessionSocket!.on("categories", (categories: string[]) => {
            console.log("categories", categories);
            this.updateSession({ categories });
          });

          this.sessionSocket!.on("difficulties", (difficulties: string[]) => {
            console.log("difficulties", difficulties);
            this.updateSession({ difficulties });
          });
        }
      });

      this.sessionSocket!.on("add-user", (username: string) => {
        console.log("Adding user to session", username);
        if (this.session) {
          this.updateSession({
            users: { ...this.session.users, [username]: 0 },
          });
        }
      });

      this.sessionSocket!.on("remove-user", (username: string) => {
        console.log("Removing user from session", username);
        if (this.session) {
          const { [username]: user, ...users } = this.session.users;
          this.updateSession({ users: users });
        }
      });

      this.sessionSocket!.on("set-library", (name: string) => {
        console.log("Setting library", name);
        this.updateSession({ library: [name] });
      });

      this.sessionSocket!.on("set-category", (name: string) => {
        console.log("Setting category", name);
        this.updateSession({ category: [name] });
      });

      this.sessionSocket!.on("set-difficulty", (name: string) => {
        console.log("Setting difficulty", name);
        this.updateSession({ difficulty: [name] });
      });

      this.sessionSocket?.on("set-stage-lobby", () => {
        this.updateSession({ stage: "lobby" });
      });

      this.sessionSocket!.on("set-stage-question", (question) => {
        console.log("Setting stage to question", question);
        this.startTimeInterval(this.session!.questionTime);
        this.updateSession({ stage: "question", question });
      });

      this.sessionSocket?.on("set-stage-middle", (users) => {
        console.log("Setting stage to middle", users);
        this.startTimeInterval(this.session!.middleTime);
        this.updateSession({ stage: "middle", users });
      });

      this.sessionSocket?.on("set-stage-end", (scoreboard) => {
        this.clearTimeInterval();
        this.updateSession({ stage: "end", scoreboard });
      });
    });
  }

  public leaveSession(): void {
    this.sessionSocket!.emit("leave-session");
    this.sessionSocket = null;
    this.setSession(null);
    this.clearLocalStorage();
  }

  public startSession(): void {
    this.sessionSocket!.emit("start-session");
  }

  public resetSession(): void {
    this.sessionSocket!.emit("reset-session");
  }

  public startSessionSearch(): void {
    if (!this.defaultSocket) return;
    this.defaultSocket.emit("search-sessions");
    this.defaultSocket.once("sessions-info", (sessionInfos: ISessionInfos) => {
      console.log("Session Info", sessionInfos);
      this.setAvailableSessions(sessionInfos);

      this.defaultSocket!.on(
        "add-session-info",
        (sessionInfo: ISessionInfo) => {
          console.log("add-session-info", sessionInfo);
          this.setAvailableSessions({
            ...this.availableSessions,
            [sessionInfo.id]: sessionInfo,
          });
        }
      );

      this.defaultSocket!.on("remove-session-info", (id: string) => {
        console.log("remove-session-info", id);
        const { [id]: toBeRemoved, ...availableSessions } =
          this.availableSessions;
        this.setAvailableSessions(availableSessions);
      });
    });
  }

  public stopSessionSearch(): void {
    if (!this.defaultSocket) return;
    this.defaultSocket.emit("search-sessions-stop");
    this.defaultSocket.off("add-session-info");
    this.defaultSocket.off("remove-session-info");
  }

  public sendAnswer(answer: string): void {
    this.sessionSocket!.emit("send-answer", answer);
  }

  private setLocals(locals: ILocals): void {
    this.locals = locals;
    if (this.setLocalsCallback) {
      this.setLocalsCallback(locals);
    }
  }

  private setSession(session: ISession | null): void {
    this.session = session;
    if (this.setSessionCallback) {
      this.setSessionCallback(session);
    }
  }

  private setAvailableSessions(sessionInfos: ISessionInfos): void {
    console.log("availableSessions", sessionInfos);
    this.availableSessions = sessionInfos;
    if (this.setAvailableSessionCallback) {
      this.setAvailableSessionCallback(this.availableSessions);
    }
  }

  // TODO Check ts-type for param
  private updateSession(updates: {}) {
    if (this.session) this.setSession({ ...this.session, ...updates });
  }

  // TODO Check ts-type for param
  private updateLocals(updates: {}) {
    console.log("Update locals", updates);
    this.setLocals({ ...this.locals, ...updates });
  }

  private clearTimeInterval(): void {
    this.locals.currentTime = undefined;
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  private decreaseTime(): void {
    this.updateLocals({
      ...this.locals,
      currentTime: this.locals.currentTime! - TIME_UPDATE_MS / 1000,
    });
  }

  private startTimeInterval(time: number): void {
    console.log("Starting time interval", time);
    this.clearTimeInterval();
    this.updateLocals({ currentTime: time });
    this.timeInterval = setInterval(() => this.decreaseTime(), TIME_UPDATE_MS);
  }

  private setupEventListeners(): void {
    if (!this.defaultSocket) return;
    this.defaultSocket.on("connect", () => {
      console.log("Connected to Default Namespace");

      this.defaultSocket!.on("disconnect", () => {
        console.log("Disconnected from Default Namespace");
      });
    });
  }

  private clearLocalStorage(): void {
    localStorage.removeItem(this.localStorageKey);
  }

  private saveLocalStorage(): void {
    if (this.session) {
      const { id, username } = this.session;
      console.log("Saving Local Storage", id, username);
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify({ id: id, username })
      );
    }
  }

  public getLocalStorage(): LOCAL_STORAGE_TYPE | null {
    const localItem = localStorage.getItem(this.localStorageKey);
    if (localItem) {
      const data: LOCAL_STORAGE_TYPE = JSON.parse(localItem);
      return data;
    }
    return null;
  }
}
