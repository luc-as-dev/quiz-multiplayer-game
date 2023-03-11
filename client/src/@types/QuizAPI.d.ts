export type createSessionResponseType = {
  username: string;
  gameId: string;
  updatedAt: number;
};

export type joinSessionResponseType = {
  username: string;
  gameId: string;
  players: { [username: string]: number };
  gameOn: boolean;
  updatedAt: number;
};
