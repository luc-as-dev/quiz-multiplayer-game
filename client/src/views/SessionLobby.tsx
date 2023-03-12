import React from "react";
import { SessionContextType } from "../@types/Session";
import Card from "../components/Card";
import useSession from "../hooks/useSession";

type Props = {};

export default function SessionLobby({}: Props) {
  const {
    getSession,
    startSession,
    leaveSession,
    getPlayers,
  }: SessionContextType = useSession();

  function startGameHandler() {
    if (getSession() && getSession()!.isOwner) {
      startSession();
    }
  }

  function leaveSessionHandler() {
    leaveSession();
  }

  return (
    <div className="view">
      <Card className="grow-10">
        <p className="medium-text">Session {getSession()?.id}</p>
        <div className="flex-wrap">
          <p>Deltagare:</p>
          {getPlayers()?.map((player) => (
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
