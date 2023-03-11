export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  updatedAt: number;
}

export type SessionContextType = {
  hasSession: () => boolean;
  getSession: () => ISession | null;
  setSession: (session: ISession) => void | undefined;
  clearSession: () => void | undefined;
};
