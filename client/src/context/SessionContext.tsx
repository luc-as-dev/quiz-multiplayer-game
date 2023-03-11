import React, { createContext, ReactNode, useContext, useState } from "react";
import { ISession, SessionContextType } from "../@types/Session";

export const SessionContext = createContext<SessionContextType>({
  hasSession: () => false,
  getSession: () => null,
  setSession: (session: ISession) => undefined,
  clearSession: () => undefined,
});

type Props = {
  children: ReactNode;
};

export default function SessionProvider({ children }: Props) {
  const [savedSession, setSavedSession] = useState<ISession | null>(null);

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
      value={{ hasSession, getSession, setSession, clearSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSessionContext: Function = (): SessionContextType =>
  useContext<SessionContextType>(SessionContext);
