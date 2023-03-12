import React, { createContext, ReactNode, useEffect, useState } from "react";
import {
  pingSessionResponseType,
  createSessionResponseType,
  joinSessionResponseType,
  updateSessionResponseType,
} from "../@types/QuizAPI";
import {
  pingSessionFetch,
  createSessionFetch,
  joinSessionFetch,
  updateSessionFetch,
  leaveSessionFetch,
  sendAnswerFetch,
  startSessionFetch,
} from "../api/QuizAPI";
import { IQuestion, ISession, SessionContextType } from "../@types/Session";

const UPDATE_INTERVAL = import.meta.env.VITE_SOME_UPDATE_INTERVAL;
const LOCAL_STORAGE_KEY = "quiz";

export const sessionContext = createContext<SessionContextType | null>(null);

function useProvideSession(): SessionContextType {
  const [savedSession, setSavedSession] = useState<ISession | null>(null);
  const [updateInterval, setUpdateInterval] = useState<number | null>(null);
  const [updates, setUpdates] = useState<number>(0);
  const [question, setQuestion] = useState<IQuestion | null>(null);

  useEffect(() => {
    localLoad();
  }, []);

  useEffect(() => {
    if (updates > 0) {
      update();
    }
  }, [updates]);

  function localClear(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  function localSave(session: ISession): void {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        id: session.id,
        username: session.username,
      })
    );
  }

  function localLoad(): void {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
    }
  }

  function startInterval(session: ISession) {
    localSave(session);
    setSavedSession(session);
    setUpdateInterval(
      setInterval(() => {
        setUpdates((current) => current + 1);
      }, UPDATE_INTERVAL)
    );
  }

  function stopInterval() {
    setUpdates(0);
    if (updateInterval) clearInterval(updateInterval);
  }

  function sendAnswer(answer: string): void {
    if (savedSession) {
      sendAnswerFetch(savedSession.id, savedSession.username, answer);
    }
  }

  async function hasUpdate(): Promise<boolean> {
    if (savedSession) {
      const checkResponse: pingSessionResponseType = await pingSessionFetch(
        savedSession.id,
        savedSession.username
      );
      return checkResponse.updatedAt > savedSession.updatedAt;
    }
    return false;
  }

  async function updateSession(id: string, username: string) {
    const session: updateSessionResponseType | undefined =
      await updateSessionFetch(id, username);

    if (session) {
      if (session.question) {
        setQuestion(session.question);
      }
      setSavedSession(session!);
    }
  }

  async function update(): Promise<void> {
    if (savedSession) {
      if (await hasUpdate()) {
        updateSession(savedSession.id, savedSession.username);
      }
    }
  }

  function getPlayers(): string[] {
    if (savedSession) {
      return Object.keys(savedSession.players);
    }
    return [];
  }

  function getQuestion(): IQuestion | null {
    return question;
  }

  function startSession() {
    if (savedSession && savedSession.isOwner) {
      startSessionFetch(savedSession.id, savedSession.username);
    }
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
        question: null,
        updatedAt: sessionResponse.updatedAt,
        stage: "lobby",
      };
      startInterval(session);
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
        question: null,
        updatedAt: sessionResponse.updatedAt,
        stage: "lobby",
      };
      startInterval(session);
      return true;
    }
    return false;
  }

  async function leaveSession(): Promise<boolean> {
    if (savedSession) {
      stopInterval();
      setSavedSession(null);
      return await leaveSessionFetch(savedSession.id, savedSession.username);
    }
    return false;
  }

  return {
    getPlayers,
    getQuestion,
    sendAnswer,
    startSession,
    hasSession,
    getSession,
    clearSession,
    createSession,
    joinSession,
    leaveSession,
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
