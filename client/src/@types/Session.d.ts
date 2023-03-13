export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: number };
  question: IQuestion | null;
  updatedAt: number;
  stage: "lobby" | number | "end";
}

export interface IQuestion {
  time: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  type: "boolean" | "multiple";
  question: string;
  answers: string[];
}

export type SessionContextType = {
  getId: () => string | undefined;
  getUsername: () => string | undefined;
  getIsOwner: () => boolean | undefined;
  getPlayers: () => string[] | undefined;
  getQuestion: () => IQuestion | null | undefined;
  getStage: () => string | number | undefined;

  sendAnswer: (answer: string) => void | null;

  hasSession: () => boolean;
  startSession: () => void | undefined;
  createSession: (name: string, username: string) => Promise<boolean>;
  joinSession: (name: string, username: string) => Promise<boolean>;
  leaveSession: () => Promise<boolean>;
};
