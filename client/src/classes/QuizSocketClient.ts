import { io } from "socket.io-client";
import {
  DefaultSocket,
  SessionSocket,
  ISession,
  ISessionInfo,
  ISessionInfos,
} from "../@types/QuizClient";

const DEFAULT_NSP = "/quiz-mp";
const SESSION_NSP_PREFIX = "/quiz-mp-session-";

const LOCAL_STORAGE_KEY = "quiz";
type LOCAL_STORAGE_TYPE = { id: string; username: string };

type Params = {
  serverURL: string;
  setSession?: (session: ISession) => void;
  setSearchSessions?: (sessionInfos: ISessionInfos) => void;
  defaultNSP?: string;
  sessionNSP?: string;
};

export class QuizSocketClient {
  private defaultSocket: DefaultSocket;
  private sessionNSPPrefix: string;
  private sessionSocket: SessionSocket | null = null;

  private session: ISession | null = null;
  private setSessionCallback: Function | null;

  private setAvailableSessionCallback: Function | null;
  private availableSessions: ISessionInfos = {};

  public getSession = () => ({ ...this.session });
  public getSessionSearch = () => ({ ...this.availableSessions });

  public hasSession = () => !!this.session;

  constructor(params: Params) {
    this.sessionNSPPrefix =
      params.serverURL + (params.sessionNSP || SESSION_NSP_PREFIX);
    this.defaultSocket = io(
      params.serverURL + (params.defaultNSP || DEFAULT_NSP)
    );

    this.setSessionCallback = params.setSession || null;
    this.setAvailableSessionCallback = params.setSearchSessions || null;

    this.setupEventListeners();
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

  public async localLoad(): Promise<void> {
    const localItem = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localItem) {
      const { id, username }: LOCAL_STORAGE_TYPE = JSON.parse(localItem);
      // TODO fix auto-connect to session
    }
  }

  public createSession(id: string, username: string): void {
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
        this.setSession(session);

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
          this.updateSession({ players: users });
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

      this.sessionSocket!.on("set-stage", (stage, question) => {
        console.log("Setting stage", stage, question);
        this.updateSession({ stage, question });
      });
    });
  }

  public leaveSession(): void {
    this.sessionSocket!.emit("leave-session");
    this.sessionSocket = null;
    this.setSession(null);
  }

  public startSession(): void {
    this.sessionSocket!.emit("start-session");
  }

  public startSessionSearch(): void {
    this.defaultSocket.emit("search-sessions");
    this.defaultSocket.once("sessions-info", (sessionInfos: ISessionInfos) => {
      console.log("Session Info", sessionInfos);
      this.setAvailableSessions(sessionInfos);

      this.defaultSocket.on("add-session-info", (sessionInfo: ISessionInfo) => {
        console.log("add-session-info", sessionInfo);
        this.setAvailableSessions({
          ...this.availableSessions,
          [sessionInfo.id]: sessionInfo,
        });
      });

      this.defaultSocket.on("remove-session-info", (id: string) => {
        console.log("remove-session-info", id);
        const { [id]: toBeRemoved, ...availableSessions } =
          this.availableSessions;
        this.setAvailableSessions(availableSessions);
      });
    });
  }

  public stopSessionSearch(): void {
    this.defaultSocket.emit("search-sessions-stop");
    this.defaultSocket.off("add-session-info");
    this.defaultSocket.off("remove-session-info");
  }

  public sendAnswer(answer: string): void {
    this.sessionSocket!.emit("send-answer", answer);
  }

  private setupEventListeners(): void {
    this.defaultSocket.on("connect", () => {
      console.log("Connected to server");
    });
  }

  private setSession(session: ISession | null): void {
    this.session = session;
    if (this.setSessionCallback) {
      this.setSessionCallback(session);
    }
  }

  // TODO Check ts-type for param
  private updateSession(update: {}) {
    if (this.session) this.setSession({ ...this.session, ...update });
  }

  private setAvailableSessions(sessionInfos: ISessionInfos): void {
    console.log("availableSessions", sessionInfos);
    this.availableSessions = sessionInfos;
    if (this.setAvailableSessionCallback) {
      this.setAvailableSessionCallback(this.availableSessions);
    }
  }

  private localClear(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  private localSave(): void {
    if (this.session) {
      const { id, username } = this.session!;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ id, username }));
    }
  }
}
