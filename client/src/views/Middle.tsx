import React from "react";
import Card from "../components/UI/Card/Card";
import useSession from "../hooks/useSession";

type Props = {};

export default function Middle({}: Props) {
  const session = useSession();

  return (
    <div className="view">
      <Card className="logo-card">
        <h2 className="big-text">Gör dig redo!</h2>
        <h4 className="medium-text">Fråga om {session.getCurrentTime()}...</h4>
      </Card>
      <div className="grow-1"></div>
    </div>
  );
}
