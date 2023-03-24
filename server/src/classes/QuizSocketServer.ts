import { Server as ServerHttp } from "http";
import { Namespace, Server as ServerIO } from "socket.io";
import { DefaultSocket, ISessionInfos } from "../@types/QuizServer";
import GameSession from "./GameSession";
import QuestionLibrary from "./QuestionLibrary";

const DEFAULT_NSP = "/quiz-mp";
const SESSION_NSP_PREFIX = "/quiz-mp-session-";
const SESSION_SEARCH_ROOM = "searching";

type Options = {
  origin?: string;
  defaultNSP?: string;
  sessionNSPrefix?: string;
};

export default class QuizSocketServer {
  io: ServerIO;
  defaultNS: Namespace;
  sessionNSPPrefix: string;
  gameSessions: { [id: string]: GameSession } = {};
  libraries: QuestionLibrary[] = [];

  constructor(server: ServerHttp, options: Options) {
    this.io = new ServerIO(server, { cors: { origin: options.origin } });
    this.defaultNS = this.io.of(options.defaultNSP || DEFAULT_NSP);
    this.sessionNSPPrefix = options.sessionNSPrefix || SESSION_NSP_PREFIX;
    this.setupEventListeners();
  }

  public addLibrary(library: QuestionLibrary): boolean {
    this.libraries.push(library);
    return false;
  }

  private createSession(socket: DefaultSocket, { id, username }): void {
    // TODO: check if session already exists
    // TODO: ID-character validation
    const onDelete = (): void => {
      this.defaultNS.to(SESSION_SEARCH_ROOM).emit("remove-session-info", id);
      delete this.gameSessions[id];
    };

    const gameSession = new GameSession({
      io: this.io,
      libraries: this.libraries,
      nspPrefix: this.sessionNSPPrefix,
      id,
      username,
      onDelete,
    });
    this.gameSessions[id] = gameSession;

    // TODO: check success?
    socket.emit("session-created");

    const sI = gameSession.getSessionInfo();
    this.defaultNS.to(SESSION_SEARCH_ROOM).emit("add-session-info", sI);
  }

  private searchSession(socket: DefaultSocket): void {
    const sessionInfos: ISessionInfos = {};
    Object.keys(this.gameSessions).forEach(
      (id) => (sessionInfos[id] = this.gameSessions[id].getSessionInfo())
    );

    socket.emit("sessions-info", sessionInfos);

    socket.join(SESSION_SEARCH_ROOM);
    socket.on("search-sessions-stop", () => socket.leave(SESSION_SEARCH_ROOM));
  }

  private setupEventListeners(): void {
    this.defaultNS.on("connection", (socket: DefaultSocket) => {
      console.log("Client connected");

      socket.on("create-session", (data) => this.createSession(socket, data));

      socket.on("search-sessions", () => this.searchSession(socket));

      socket.on("disconnect", () => console.log("Client disconnected"));
    });
  }
}
