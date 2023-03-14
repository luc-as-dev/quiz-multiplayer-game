import React, { useEffect, useState } from "react";
import { SessionContextType } from "../@types/Session";
import { ViewContextType } from "../@types/View";
import Card from "../components/UI/Card";
import SessionsList from "../components/SessionsList";
import { useViewContext } from "../context/ViewContext";
import useSession from "../hooks/useSession";
import JoinSession from "./JoinSession";

type Props = {};

export default function SearchSession({}: Props) {
  const { setView }: ViewContextType = useViewContext();
  const session: SessionContextType = useSession();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    session.startSessionSearch();
    return () => {
      session.stopSessionSearch();
    };
  }, []);

  function joinSessionHandler(): void {
    if (selectedId) setView(<JoinSession sessionId={selectedId} />);
  }

  function leaveSessionHandler(): void {
    setView(<JoinSession />);
  }

  return (
    <div className="view">
      <Card className="grow-10">
        <h3>Sök sessioner</h3>
        <SessionsList
          className="grow-10"
          gameInfos={session.getSearchSessions()}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </Card>
      <Card className="big-text grow-1" onClick={joinSessionHandler}>
        Gå med
      </Card>
      <Card className="big-text grow-1" onClick={leaveSessionHandler}>
        Tillbaka
      </Card>
    </div>
  );
}
