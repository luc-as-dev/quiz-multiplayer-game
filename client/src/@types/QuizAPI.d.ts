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

export type checkSessionResponseType = {
  updatedAt: number;
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

export type updateSessionResponseType = {
  id: string;
  username: string;
  isOwner: boolean;
  players: { [username: string]: number };
  gameOn: boolean;
  updatedAt: number;
  stage: "lobby" | number | "end";
};

export type questionResponseType = {
  time: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  type: "boolean" | "multiple";
  question: string;
  answers: string[];
};
