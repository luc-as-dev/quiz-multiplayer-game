export interface IQuestion {
  category: string;
  difficulty: string;
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

interface IGameInfo {
  gameId: string;
  players: string[];
  owner: string;
}
