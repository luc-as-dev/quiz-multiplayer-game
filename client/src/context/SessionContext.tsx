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
  const [currentSession, setCurrentSession] = useState<ISession | null>(null);
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

  async function localLoad(): Promise<void> {
    const localStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localStr) {
      const data: { id: string; username: string } = JSON.parse(localStr);
      const session = await updateSession(data.id, data.username);
      if (session) {
        startInterval(session);
      } else {
        localClear();
      }
    }
  }

  function startInterval(session: ISession) {
    localSave(session);
    setCurrentSession(session);
    setUpdateInterval(
      setInterval(() => {
        setUpdates((current) => current + 1);
      }, UPDATE_INTERVAL)
    );
  }

  function stopInterval() {
    setUpdates(0);
    if (updateInterval) clearInterval(updateInterval);
    localClear();
  }

  async function hasUpdate(): Promise<boolean> {
    if (currentSession) {
      const checkResponse: pingSessionResponseType = await pingSessionFetch(
        currentSession.id,
        currentSession.username
      );
      return checkResponse.updatedAt > currentSession.updatedAt;
    }
    return false;
  }

  async function updateSession(
    id: string,
    username: string
  ): Promise<ISession | null> {
    const session: updateSessionResponseType | undefined =
      await updateSessionFetch(id, username);

    if (session) {
      if (session.question) {
        setQuestion(session.question);
      }
      setCurrentSession(session!);
      return session;
    }
    return null;
  }

  async function update(): Promise<void> {
    if (currentSession) {
      if (await hasUpdate()) {
        updateSession(currentSession.id, currentSession.username);
      }
    }
  }

  function getId(): string | undefined {
    if (currentSession) return currentSession.id;
    return undefined;
  }

  function getUsername(): string | undefined {
    if (currentSession) return currentSession.username;
    return undefined;
  }

  function getIsOwner(): boolean | undefined {
    if (currentSession) return currentSession.isOwner;
    return undefined;
  }

  function getPlayers(): string[] | undefined {
    if (currentSession) return Object.keys(currentSession.players);
    return undefined;
  }

  function getQuestion(): IQuestion | null | undefined {
    if (currentSession) return question;
    return undefined;
  }

  function getStage(): string | number | undefined {
    if (currentSession) return currentSession.stage;
    return undefined;
  }

  function sendAnswer(answer: string): void {
    if (currentSession) {
      sendAnswerFetch(currentSession.id, currentSession.username, answer);
    }
  }

  function hasSession(): boolean {
    return currentSession !== null;
  }

  function startSession() {
    if (currentSession && currentSession.isOwner) {
      startSessionFetch(currentSession.id, currentSession.username);
    }
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
    if (currentSession) {
      stopInterval();
      setCurrentSession(null);
      return await leaveSessionFetch(
        currentSession.id,
        currentSession.username
      );
    }
    return false;
  }

  return {
    getId,
    getUsername,
    getIsOwner,
    getPlayers,
    getQuestion,
    getStage,
    sendAnswer,
    startSession,
    hasSession,
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
