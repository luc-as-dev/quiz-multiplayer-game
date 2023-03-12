export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: number };
  gameOn: boolean;
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
  nextQuestion: () => void | undefined;
  getPlayers: () => string[];
  getQuestion: () => IQuestion | null;

  hasSession: () => boolean;
  getSession: () => ISession | null;
  clearSession: () => void | undefined;
  createSession: (name: string, username: string) => Promise<boolean>;
  joinSession: (name: string, username: string) => Promise<boolean>;
  leaveSession: () => Promise<boolean>;
};
