import React, { createContext, ReactNode, useState } from "react";
import { IGameInfo, IQuestion, ISession } from "../@types/QuizClient";
import { SessionContextType } from "../@types/Session";
import { QuizClient } from "../api/QuizClient";

export const sessionContext = createContext<SessionContextType | null>(null);

function useProvideSession(
  serverURL: string,
  updateMS: number | undefined
): SessionContextType {
  const [session, setSession] = useState<ISession | null>(null);
  const [searchSessions, setSearchSessions] = useState<IGameInfo[]>([]);
  const [quizClient] = useState<QuizClient>(
    new QuizClient(serverURL, setSession, setSearchSessions, updateMS)
  );

  function getId(): string | undefined {
    if (session) return session.id;
    return undefined;
  }

  function getUsername(): string | undefined {
    if (session) return session.username;
    return undefined;
  }

  function getIsOwner(): boolean | undefined {
    if (session) return session.isOwner;
    return undefined;
  }

  function getPlayers(): string[] | undefined {
    if (session) return Object.keys(session.players);
    return undefined;
  }

  function getScores(): { [username: string]: number } | undefined {
    if (session) return session.players;
    return undefined;
  }

  function getQuestion(): IQuestion | null | undefined {
    if (session) return session.question;
    return undefined;
  }

  function getStage(): "lobby" | number | "end" | undefined {
    if (session) return session.stage;
    return undefined;
  }

  function getSearchSessions(): IGameInfo[] {
    return searchSessions;
  }

  function sendAnswer(answer: string): void {
    if (session) {
      quizClient.sendAnswer(answer);
    }
  }

  function startSessionSearch(): boolean {
    return quizClient.startSessionSearch();
  }

  function stopSessionSearch(): boolean {
    return quizClient.stopSessionSearch();
  }

  function hasSession(): boolean {
    return quizClient.getSession() !== null;
  }

  async function startSession(): Promise<boolean> {
    const session = quizClient.getSession();
    if (session && session.isOwner) {
      return await quizClient.startSession();
    }
    return false;
  }

  async function createSession(
    sessionId: string,
    username: string
  ): Promise<boolean> {
    return await quizClient.createSession(sessionId, username);
  }

  async function joinSession(
    sessionId: string,
    username: string
  ): Promise<boolean> {
    return await quizClient.joinSession(sessionId, username);
  }

  async function leaveSession(): Promise<boolean> {
    return await quizClient.leaveSession();
  }

  return {
    getId,
    getUsername,
    getIsOwner,
    getPlayers,
    getScores,
    getQuestion,
    getStage,
    getSearchSessions,
    sendAnswer,
    startSessionSearch,
    stopSessionSearch,
    startSession,
    hasSession,
    createSession,
    joinSession,
    leaveSession,
  };
}

type Props = {
  children: ReactNode;
  serverURL: string;
  updateMS?: number;
};

export default function SessionProvider({
  children,
  serverURL,
  updateMS,
}: Props) {
  const session: SessionContextType = useProvideSession(serverURL, updateMS);
  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  );
}
