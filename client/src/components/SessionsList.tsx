import React from "react";
import { IGameInfo } from "../@types/QuizClient";

type Props = {
  className?: string | undefined;
  gameInfos: IGameInfo[];
  selectedId: string | null;
  setSelectedId: Function;
};

export default function SessionsList({
  className,
  gameInfos,
  selectedId,
  setSelectedId,
}: Props) {
  return (
    <div className={`list ${className || ""}`}>
      {gameInfos.length > 0
        ? gameInfos.map((gameInfo: IGameInfo) => (
            <div
              className={`item ${
                selectedId === gameInfo.gameId ? "selected" : ""
              }`}
              onClick={() => setSelectedId(gameInfo.gameId)}
              key={gameInfo.gameId}
            >
              <div>{gameInfo.gameId}</div>
              <div>{gameInfo.owner}</div>
            </div>
          ))
        : "Det finns inga öppna sessioner"}
    </div>
  );
}
