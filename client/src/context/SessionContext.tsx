import React, { createContext, ReactNode, useContext, useState } from "react";
import { ISession, SessionContextType } from "../@types/Session";

export const SessionContext = createContext<SessionContextType | null>(null);

export function useSessionContext() {
  const sessionContext = useContext(SessionContext);
  if (!sessionContext) {
    throw new Error(
      "useSessionContext has to be used within <SessionProvider>"
    );
  }
  return sessionContext;
}

type Props = {
  children: ReactNode;
};

export default function SessionProvider({ children }: Props) {
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

  return (
    <SessionContext.Provider
      value={{ getPlayers, hasSession, getSession, setSession, clearSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}
