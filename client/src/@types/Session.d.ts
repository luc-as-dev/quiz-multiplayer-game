export type SessionContextType = {
  getId: () => string | undefined;
  getUsername: () => string | undefined;
  getIsOwner: () => boolean | undefined;
  getPlayers: () => string[] | undefined;
  getScores: () => { [username: string]: number } | undefined;
  getQuestion: () => IQuestion | null | undefined;
  getStage: () => string | number | undefined;

  sendAnswer: (answer: string) => void | null;

  hasSession: () => boolean;
  startSession: () => Promise<boolean> | undefined;
  createSession: (name: string, username: string) => Promise<boolean>;
  joinSession: (name: string, username: string) => Promise<boolean>;
  leaveSession: () => Promise<boolean>;
};
