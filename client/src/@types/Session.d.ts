export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: string };
  gameOn: boolean;
  updatedAt: number;
}

export type SessionContextType = {
  getPlayers: () => string[];

  hasSession: () => boolean;
  getSession: () => ISession | null;
  setSession: (session: ISession) => void | undefined;
  clearSession: () => void | undefined;
};
