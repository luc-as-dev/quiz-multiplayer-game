import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface ICategory {
  name: string;
}

export interface IDifficulty {
  name: string;
  multiplier: number;
}

export interface IQuestion {
  category: ICategory["name"];
  difficulty: IDifficulty["name"];
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
}

export interface ISafeQuestion {
  category: ICategory["name"];
  difficulty: IDifficulty["name"];
  question: string;
  answers: string[];
}

interface ILibrary {
  categories: string[];
  difficulties: string[];
  questions: number;
}

interface IUsers {
  [username: string]: number;
}

export type StageType = "lobby" | "question" | "middle" | "end";

export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  users: IUsers;
  question: ISafeQuestion | null;
  updatedAt: number;
  stage: StageType;
  questionTime: number;
  middleTime: number;
  library: string;
  category?: string;
  difficulty?: string;
  libraries?: string[];
  categories?: string[];
  difficulties?: string[];
}

interface ISessionInfo {
  id: string;
  users: string[];
  owner: string;
}

interface ISessionInfos {
  [id: string]: ISessionInfo;
}

interface IOwnerInfo {
  libraries: string[];
  categories: string[];
  difficulties: string[];
}

interface ServerToSocketEvents {
  "session-created": () => void;
  "sessions-info": (sessionInfos: ISessionInfos) => void;
  "add-session-info": (sessionInfo: ISessionInfo) => void;
  "remove-session-info": (id: string) => void;
}

interface SocketToServerEvents {
  "create-session": (data: { id: string; username: string }) => void;
  "search-sessions": () => void;
  "search-sessions-stop": () => void;
}

interface SessionToSocketEvents {
  session: (session: ISession) => void;
  libraries: (libraries: ILibrary[]) => void;
}

interface SocketToSessionsEvents {
  "join-session": (username: string) => void;
  "leave-session": () => void;
  "get-owner-info": () => void;
  "set-library": (name: string) => void;
  "set-category": (name: string) => void;
  "set-difficulty": (name: string) => void;
  "start-session": () => void;
  "send-answer": (answer: string) => void; // TODO add
}

interface SessionToClientEvents {
  "add-user": (username: string) => void;
  "remove-user": (username: string) => void;
  "set-library": (library: string) => void;
  "set-category": (category: string) => void;
  "set-difficulty": (difficulty: string) => void;
  "set-stage-lobby": () => void;
  "set-stage-end": (users: IUsers) => void;
  "set-stage-middle": (users: IUsers | null) => void;
  "set-stage-question": (question: ISafeQuestion | null) => void;
  libraries: (libraries: string[]) => void;
  categories: (categories: string[]) => void;
  difficulties: (difficulties: string[]) => void;
}

type DefaultSocket = Socket<SocketToServerEvents, ServerToSocketEvents>;

type SessionSocket = Socket<SocketToSessionsEvents, SessionToSocketEvents>;

type SessionNamespace = Namespace<DefaultEventsMap, SessionToClientEvents>;
