export interface ICategory {
  name: string;
}

export interface IDifficulty {
  name: string;
  multiplier: number;
}

export interface IQuestion {
  category: ICategory["name"];
  difficulty: IDifficulty["name"];
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
}

export interface ISafeQuestion {
  category: ICategory["name"];
  difficulty: IDifficulty["name"];
  question: string;
  answers: string[];
}

export type StageType = "lobby" | number | "end";

export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: number };
  question: ISafeQuestion | null;
  updatedAt: number;
  stage: StageType;
}

interface IGameInfo {
  gameId: string;
  players: string[];
  owner: string;
}

interface ILibrary {
  categories: string[];
  difficulties: string[];
  questions: number;
}

interface IUser {
  name: string;
  score: number;
}
