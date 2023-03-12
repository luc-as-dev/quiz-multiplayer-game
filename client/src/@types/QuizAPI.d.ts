import { IQuestion } from "./Session";

export type createSessionResponseType = {
  username: string;
  id: string;
  updatedAt: number;
  stage: "lobby" | number | "end";
};

export type joinSessionResponseType = {
  username: string;
  id: string;
  players: { [username: string]: number };
  gameOn: boolean;
  updatedAt: number;
  stage: "lobby" | number | "end";
};

export type pingSessionResponseType = {
  updatedAt: number;
};

export type updateSessionResponseType = {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: number };
  gameOn: boolean;
  question: IQuestion;
  updatedAt: number;
  stage: "lobby" | number | "end";
};

export type updateSessionResponseType = {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: number };
  gameOn: boolean;
  updatedAt: number;
  stage: "lobby" | number | "end";
};
