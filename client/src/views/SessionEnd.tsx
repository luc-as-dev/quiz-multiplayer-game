import React from "react";
import { SessionContextType } from "../@types/Session";
import Card from "../components/UI/Card/Card";
import useSession from "../hooks/useSession";

type Props = {};

export default function SessionEnd({}: Props) {
  const session: SessionContextType = useSession();

  function leaveSessionHandler() {
    session.leaveSession();
  }

  return (
    <div className="view">
      <Card className="grow-10">
        {session.getPlayers()?.map((username: string) => {
          return (
            <p key={username}>
              {username} - {session.getScores()![username]}
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
