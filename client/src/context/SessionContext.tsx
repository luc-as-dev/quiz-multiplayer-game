import React, { createContext, ReactNode, useEffect, useState } from "react";
import {
  checkSessionResponseType,
  createSessionResponseType,
  joinSessionResponseType,
  updateSessionResponseType,
} from "../@types/QuizAPI";
import {
  checkSessionFetch,
  createSessionFetch,
  joinSessionFetch,
  updateSessionFetch,
} from "../api/QuizAPI";
import { ISession, SessionContextType } from "../@types/Session";

const UPDATE_INTERVAL = import.meta.env.VITE_SOME_UPDATE_INTERVAL;

export const sessionContext = createContext<SessionContextType | null>(null);

function useProvideSession(): SessionContextType {
  const [savedSession, setSavedSession] = useState<ISession | null>(null);
  const [updateInterval, setUpdateInterval] = useState<number | null>(null);
  const [updates, setUpdates] = useState<number>(0);

  useEffect(() => {
    if (updates > 0) {
      update();
    }
  }, [updates]);

  function start(session: ISession) {
    setSavedSession(session);
    setUpdateInterval(
      setInterval(() => {
        setUpdates((current) => current + 1);
      }, UPDATE_INTERVAL)
    );
  }

  function stop() {
    setUpdates(0);
    if (updateInterval) clearInterval(updateInterval);
  }

  async function hasUpdate(): Promise<boolean> {
    if (savedSession) {
      const checkResponse: checkSessionResponseType = await checkSessionFetch(
        savedSession.id
      );
      return checkResponse.updatedAt > savedSession.updatedAt;
    }
    return false;
  }

  async function update(): Promise<void> {
    if (savedSession) {
      if (await hasUpdate()) {
        const updateResponse: updateSessionResponseType | undefined =
          await updateSessionFetch(savedSession.id, savedSession.username);

        setSavedSession(updateResponse!);
      }
    }
  }

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

  function clearSession(): void {
    setSavedSession(null);
  }

  async function createSession(
    name: string,
    username: string
  ): Promise<boolean> {
    const sessionResponse: createSessionResponseType | undefined =
      await createSessionFetch(name, username);

    if (sessionResponse) {
      const session: ISession = {
        id: sessionResponse.id,
        username: sessionResponse.username,
        isOwner: true,
        players: { [sessionResponse.username]: 0 },
        gameOn: false,
        updatedAt: sessionResponse.updatedAt,
      };
      start(session);
      return true;
    }
    return false;
  }

  async function joinSession(name: string, username: string): Promise<boolean> {
    const sessionResponse: joinSessionResponseType | undefined =
      await joinSessionFetch(name, username);
    if (sessionResponse) {
      const session: ISession = {
        id: sessionResponse.id,
        username: sessionResponse.username,
        isOwner: false,
        players: sessionResponse.players,
        gameOn: sessionResponse.gameOn,
        updatedAt: sessionResponse.updatedAt,
      };
      start(session);
      return true;
    }
    return false;
  }

  return {
    getPlayers,
    hasSession,
    getSession,
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
