export interface IQuestion {
  time: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  type: "boolean" | "multiple";
  question: string;
  answers: string[];
}

export interface ISession {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: number };
  question: IQuestion | null;
  updatedAt: number;
  stage: "lobby" | number | "end";
}
