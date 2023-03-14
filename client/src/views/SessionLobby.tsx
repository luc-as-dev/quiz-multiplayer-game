import React from "react";
import { SessionContextType } from "../@types/Session";
import Card from "../components/UI/Card";
import useSession from "../hooks/useSession";

type Props = {};

export default function SessionLobby({}: Props) {
  const session: SessionContextType = useSession();

  function startGameHandler() {
    if (session.hasSession() && session.getIsOwner()) {
      session.startSession();
    }
  }

  function leaveSessionHandler() {
    session.leaveSession();
  }

  return (
    <div className="view">
      <Card className="grow-10">
        <p className="medium-text">Session {session.getId()}</p>
        <div className="flex-wrap">
          <p>Deltagare:</p>
          {session.getPlayers()?.map((player) => (
            <p key={player}>{player}</p>
          ))}
        </div>
      </Card>
      {session.getIsOwner() && (
        <Card className="big-text grow-1" onClick={startGameHandler}>
          Starta
        </Card>
      )}
      <Card className="big-text grow-1" onClick={leaveSessionHandler}>
        Tillbaka
      </Card>
    </div>
  );
}
