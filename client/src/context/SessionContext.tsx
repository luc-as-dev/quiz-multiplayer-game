import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  createSessionResponseType,
  joinSessionResponseType,
} from "../@types/QuizAPI";
import { createSessionFetch, joinSessionFetch } from "../api/QuizAPI";
import { ISession, SessionContextType } from "../@types/Session";

export const sessionContext = createContext<SessionContextType | null>(null);

function useProvideSession() {
  const [savedSession, setSavedSession] = useState<ISession | null>(null);

  function getPlayers(): string[] {
    if (savedSession) {
      return Object.keys(savedSession.players);
    }
    return [];
  }

  function hasSession(): boolean {
    return savedSession !== null;
  }

  function getSession(): ISession | null {
    return savedSession;
  }

  function setSession(session: ISession): void {
    setSavedSession(session);
  }

  function clearSession(): void {
    setSavedSession(null);
  }

  async function createSession(
    name: string,
    username: string
  ): Promise<boolean> {
    const session: createSessionResponseType | undefined =
      await createSessionFetch(name, username);

    if (session) {
      setSession({
        id: session.gameId,
        username: session.username,
        isOwner: true,
        players: { [session.username]: 0 },
        gameOn: false,
        updatedAt: session.updatedAt,
      });
      return true;
    }
    return false;
  }

  async function joinSession(name: string, username: string): Promise<boolean> {
    const session: joinSessionResponseType | undefined = await joinSessionFetch(
      name,
      username
    );
    if (session) {
      setSession({
        id: session.gameId,
        username: session.username,
        isOwner: false,
        players: session.players,
        gameOn: session.gameOn,
        updatedAt: session.updatedAt,
      });
      return true;
    }
    return false;
  }

  return {
    getPlayers,
    hasSession,
    getSession,
    setSession,
    clearSession,
    createSession,
    joinSession,
  };
}

type Props = {
  children: ReactNode;
};

export default function SessionProvider({ children }: Props) {
  const session: SessionContextType = useProvideSession();
  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  );
}
