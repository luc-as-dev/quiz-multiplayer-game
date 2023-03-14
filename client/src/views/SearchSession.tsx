import React, { useEffect } from "react";
import { IGameInfo } from "../@types/QuizClient";
import { SessionContextType } from "../@types/Session";
import { ViewContextType } from "../@types/View";
import Card from "../components/Card";
import { useViewContext } from "../context/ViewContext";
import useSession from "../hooks/useSession";
import JoinSession from "./JoinSession";

type Props = {};

export default function SearchSession({}: Props) {
  const { setView }: ViewContextType = useViewContext();
  const session: SessionContextType = useSession();

  useEffect(() => {
    session.startSessionSearch();
    return () => {
      session.stopSessionSearch();
    };
  }, []);

  function leaveSessionHandler(): void {
    setView(<JoinSession />);
  }

  return (
    <div className="view">
      <Card className="grow-10">
        <h3>Sök sessioner</h3>
        {session.getSearchSessions().map((gameInfo: IGameInfo) => {
          return (
            <p key={gameInfo.gameId}>
              {gameInfo.gameId} - {gameInfo.players.length}st spelare
            </p>
          );
        })}
      </Card>
      <Card className="big-text grow-1" onClick={leaveSessionHandler}>
        Tillbaka
      </Card>
    </div>
  );
}
