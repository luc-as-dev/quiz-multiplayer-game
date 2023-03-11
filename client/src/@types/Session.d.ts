export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: number };
  gameOn: boolean;
  updatedAt: number;
}

export type SessionContextType = {
  getPlayers: () => string[];

  hasSession: () => boolean;
  getSession: () => ISession | null;
  setSession: (session: ISession) => void | undefined;
  clearSession: () => void | undefined;
  createSession: (name: string, username: string) => Promise<boolean>;
  joinSession: (name: string, username: string) => Promise<boolean>;
};
