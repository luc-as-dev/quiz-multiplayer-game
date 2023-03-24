import { Socket } from "socket.io-client";

export interface IQuestion {
  category: string;
  difficulty: string;
  question: string;
  answers: string[];
}

interface ILibrary {
  categories: string[];
  difficulties: string[];
  questions: number;
}

interface IUser {
  name: string;
  score: number;
}

export type StageType = "lobby" | "question" | "end";

export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  users: { [username: string]: number };
  question: ISafeQuestion | null;
  updatedAt: number;
  stage: StageType;
  maxTime: number;
  library: string;
  category?: string;
  difficulty?: string;
  libraries?: string[];
  categories?: string[];
  difficulties?: string[];
  local: {
    currentTime: number | null;
  };
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
}

interface SocketToSessionsEvents {
  "join-session": (username: string) => void;
  "leave-session": () => void;
  "get-owner-info": () => void;
  "set-library": (name: string) => void;
  "set-category": (name: string) => void;
  "set-difficulty": (name: string) => void;
  "start-session": () => void;
  "send-answer": (answer: string) => void;
}

interface SessionToClientEvents {
  "add-user": (username: string) => void;
  "remove-user": (username: string) => void;
  "set-library": (library: string) => void;
  "set-category": (category: string) => void;
  "set-difficulty": (difficulty: string) => void;
  "set-stage": (stage: StageType, question: IQuestion | null) => void;
  "set-users": (users: { [username: string]: number }) => void;
  libraries: (libraries: string[]) => void;
  categories: (categories: string[]) => void;
  difficulties: (difficulties: string[]) => void;
}

type DefaultSocket = Socket<ServerToSocketEvents, SocketToServerEvents>;

type SessionSocket = Socket<
  SessionToSocketEvents & SessionToClientEvents,
  SocketToSessionsEvents
>;
