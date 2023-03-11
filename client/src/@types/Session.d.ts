export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: number };
  gameOn: boolean;
  updatedAt: number;
  stage: "lobby" | number | "end";
}

export type SessionContextType = {
  nextQuestion: () => void | undefined;
  getPlayers: () => string[];

  hasSession: () => boolean;
  getSession: () => ISession | null;
  clearSession: () => void | undefined;
  createSession: (name: string, username: string) => Promise<boolean>;
  joinSession: (name: string, username: string) => Promise<boolean>;
};
