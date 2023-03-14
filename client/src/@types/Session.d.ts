import { IGameInfo } from "./QuizClient";

export type SessionContextType = {
  getId: () => string | undefined;
  getUsername: () => string | undefined;
  getIsOwner: () => boolean | undefined;
  getPlayers: () => string[] | undefined;
  getScores: () => { [username: string]: number } | undefined;
  getQuestion: () => IQuestion | null | undefined;
  getStage: () => string | number | undefined;
  getSearchSessions: () => IGameInfo[];

  sendAnswer: (answer: string) => void | null;

  startSessionSearch: () => boolean;
  stopSessionSearch: () => boolean;

  hasSession: () => boolean;
  startSession: () => Promise<boolean> | undefined;
  createSession: (name: string, username: string) => Promise<boolean>;
  joinSession: (name: string, username: string) => Promise<boolean>;
  leaveSession: () => Promise<boolean>;
};
