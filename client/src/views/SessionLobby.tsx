import React from "react";
import { SessionContextType } from "../@types/Session";
import { ViewContextType } from "../@types/View";
import Card from "../components/Card";
import { useViewContext } from "../context/ViewContext";
import useSession from "../hooks/useSession";
import Home from "./Home";

type Props = {};

export default function SessionLobby({}: Props) {
  const { setView }: ViewContextType = useViewContext();
  const { getSession, nextQuestion, getPlayers }: SessionContextType =
    useSession();

  function startGameHandler() {
    console.log(getSession());
    if (getSession() && getSession()!.isOwner) {
      console.log("Inside");
      nextQuestion();
    }
  }

  function leaveSessionHandler() {
    setView(<Home />);
  }

  return (
    <div className="view">
      <Card className="grow-10">
        <p className="medium-text">Session {getSession()!.id}</p>
        <div className="flex-wrap">
          <p>Deltagare:</p>
          {getPlayers().map((player) => (
            <p key={player}>{player}</p>
          ))}
        </div>
      </Card>
      <Card className="big-text grow-1" onClick={startGameHandler}>
        Starta
      </Card>
      <Card className="big-text grow-1" onClick={leaveSessionHandler}>
        Tillbaka
      </Card>
    </div>
  );
}
