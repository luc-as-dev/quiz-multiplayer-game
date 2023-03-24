import { ILibrary, ISessionInfo, ISessionInfos } from "./QuizClient";

export type SessionContextType = {
  getId: () => string | undefined;
  getUsername: () => string | undefined;
  getIsOwner: () => boolean | undefined;
  getPlayers: () => string[] | undefined;
  getScores: () => { [username: string]: number } | undefined;
  getQuestion: () => IQuestion | null | undefined;
  getStage: () => string | number | undefined;
  getCurrentTime: () => number | null;
  getMaxTime: () => number | undefined;
  getLibrary: () => string | undefined;
  getCategory: () => string | undefined;
  getDifficulty: () => string | undefined;
  getLibraries: () => string[];
  getCategories: () => string[];
  getDifficulties: () => string[];
  getSearchSessions: () => ISessionInfo[];

  setLibrary: (name: string) => void;
  setCategory: (name: string) => void;
  setDifficulty: (name: string) => void;

  sendAnswer: (answer: string) => void | null;

  startSessionSearch: () => boolean;
  stopSessionSearch: () => boolean;

  hasSession: () => boolean;
  startSession: () => Promise<boolean> | undefined;
  createSession: (name: string, username: string) => Promise<boolean>;
  joinSession: (name: string, username: string) => Promise<boolean>;
  leaveSession: () => Promise<boolean>;

  getLibraries: () => Promise<string[]>;
  getLibrary: (name: string) => Promise<ILibrary | null>;
};
