export type QuestionDifficultyType = "easy" | "medium" | "hard";
export type QuestionTypeType = "boolean" | "multiple";

export interface IQuestion {
  time: number;
  category: string;
  difficulty: QuestionDifficultyType;
  type: QuestionTypeType;
  question: string;
  answers: string[];
}

export type StageType = "lobby" | number | "end";

export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: number };
  question: IQuestion | null;
  updatedAt: number;
  stage: StageType;
}

interface IGameInfo {
  gameId: string;
  players: string[];
  owner: string;
}
