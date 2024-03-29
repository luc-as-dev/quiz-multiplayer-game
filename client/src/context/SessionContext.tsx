import React, { createContext, ReactNode, useEffect, useState } from "react";
import {
  ILocals,
  IQuestion,
  ISession,
  ISessionInfo,
  ISessionInfos,
  ScoreboardType,
  StageType,
} from "../@types/QuizClient";
import { SessionContextType } from "../@types/Session";
import { QuizSocketClient } from "../classes/QuizSocketClient";

export const sessionContext = createContext<SessionContextType | null>(null);

const quizClient: QuizSocketClient = new QuizSocketClient();

function useProvideSession(
  serverURL: string,
  localStorageKey?: string
): SessionContextType {
  const [locals, setLocals] = useState<ILocals>();
  const [session, setSession] = useState<ISession | null>(null);
  const [searchSessions, setSearchSessions] = useState<ISessionInfos>({});

  useEffect(() => {
    quizClient.start({
      serverURL,
      setLocals,
      setSession,
      setSearchSessions,
      localStorageKey,
    });
  }, []);

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
    if (session) return Object.keys(session.users);
    return undefined;
  }

  function getScoreboard(): ScoreboardType | undefined {
    if (session) return session.scoreboard;
    return undefined;
  }

  function getScores(): { [username: string]: number } | undefined {
    if (session) return session.users;
    return undefined;
  }

  function getQuestion(): IQuestion | null | undefined {
    if (session) return session.question;
    return undefined;
  }

  function getStage(): StageType | undefined {
    if (session) return session.stage;
    return undefined;
  }

  function getCurrentTime(): number | null {
    if (locals && locals.currentTime) return locals.currentTime;
    console.log(locals?.currentTime);
    return null;
  }

  function getQuestionTimeS(): number | undefined {
    if (session) return session.questionTime;
    return undefined;
  }

  function getMiddleTimeS(): number | undefined {
    if (session) return session.questionTime;
    return undefined;
  }

  function getLibrary(): string | undefined {
    if (session) return session.library;
    return undefined;
  }

  function getCategory(): string | undefined {
    if (session) return session.category;
    return undefined;
  }

  function getDifficulty(): string | undefined {
    if (session) return session.difficulty;
    return undefined;
  }

  function getLibraries(): string[] {
    if (session && session.libraries) return session.libraries;
    return [];
  }

  function getCategories(): string[] {
    if (session && session.categories) return session.categories;
    return [];
  }

  function getDifficulties(): string[] {
    if (session && session.difficulties) return session.difficulties;
    return [];
  }

  function getSearchSessions(): ISessionInfo[] {
    const sessionInfoList: ISessionInfo[] = [];
    Object.keys(searchSessions).forEach((id) => {
      sessionInfoList.push({
        id: id,
        owner: searchSessions[id].owner,
        users: searchSessions[id].users,
      });
    });
    return sessionInfoList;
  }

  function setLibrary(name: string) {
    quizClient.setLibrary(name);
  }

  function setCategory(name: string) {
    quizClient.setCategory(name);
  }

  function setDifficulty(name: string) {
    quizClient.setDifficulty(name);
  }

  function sendAnswer(answer: string): void {
    if (session) {
      quizClient.sendAnswer(answer);
    }
  }

  function startSessionSearch(): boolean {
    quizClient.startSessionSearch();
    return true;
  }

  function stopSessionSearch(): boolean {
    quizClient.stopSessionSearch();
    return true;
  }

  function hasSession(): boolean {
    return quizClient.hasSession();
  }

  // TODO remove async
  async function startSession(): Promise<boolean> {
    quizClient.startSession();
    return true;
  }

  // TODO remove async
  async function resetSession(): Promise<boolean> {
    quizClient.resetSession();
    return true;
  }

  // TODO remove async
  async function createSession(
    sessionId: string,
    username: string
  ): Promise<boolean> {
    quizClient.createSession(sessionId, username);
    return true;
  }

  // TODO remove async
  async function joinSession(
    sessionId: string,
    username: string
  ): Promise<boolean> {
    quizClient.joinSession(sessionId, username);
    return true;
  }

  // TODO remove async
  async function leaveSession(): Promise<boolean> {
    quizClient.leaveSession();
    return true;
  }

  return {
    getId,
    getUsername,
    getIsOwner,
    getPlayers,
    getScoreboard,
    getScores,
    getQuestion,
    getStage,
    getCurrentTime,
    getQuestionTimeS,
    getMiddleTimeS,
    getLibrary,
    getCategory,
    getDifficulty,
    getLibraries,
    getCategories,
    getDifficulties,
    getSearchSessions,
    setLibrary,
    setCategory,
    setDifficulty,
    sendAnswer,
    startSessionSearch,
    stopSessionSearch,
    startSession,
    resetSession,
    hasSession,
    createSession,
    joinSession,
    leaveSession,
  };
}

type Props = {
  children: ReactNode;
  serverURL: string;
  localStorageKey?: string;
};

export default function SessionProvider({
  children,
  serverURL,
  localStorageKey,
}: Props) {
  const session: SessionContextType = useProvideSession(
    serverURL,
    localStorageKey
  );
  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  );
}
