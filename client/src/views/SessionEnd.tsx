import React, { useState } from "react";
import { SessionContextType } from "../@types/Session";
import Card from "../components/UI/Card/Card";
import useSession from "../hooks/useSession";

type Props = {};

export default function SessionEnd({}: Props) {
  const session: SessionContextType = useSession();
  const [scoreboard, setScoreboard] = useState([]);

  function replaySessionHandler() {
    session.resetSession();
  }

  function leaveSessionHandler() {
    session.leaveSession();
  }

  return (
    <div className="view">
      <Card className="grow-10">
        <h2 className="big-text">Quiz Avlsutad!</h2>
        <h4 className="medium-text">Topplista</h4>
        <div>
          {session
            ?.getScoreboard()
            ?.map((user: { username: string; score: number }) => (
              <p key={user.username} className="small-text">
                {user.username} - {user.score}
              </p>
            ))}
        </div>
      </Card>
      {session.getIsOwner() && (
        <Card className="big-text grow-1" onClick={replaySessionHandler}>
          Spela igen
        </Card>
      )}
      <Card className="big-text grow-1" onClick={leaveSessionHandler}>
        Tillbaka
      </Card>
    </div>
  );
}
