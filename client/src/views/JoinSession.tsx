import React, { useState } from "react";
import { SessionContextType } from "../@types/Session";
import { ViewContextType } from "../@types/View";
import Card from "../components/Card";
import Input from "../components/Input";
import { useViewContext } from "../context/ViewContext";
import useSession from "../hooks/useSession";
import Home from "./Home";

type Props = {};

export default function JoinSession({}: Props) {
  const { setView }: ViewContextType = useViewContext();
  const { joinSession }: SessionContextType = useSession();
  const [sessionName, setSessionName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  function joinSessionHandler(): void {
    joinSession(sessionName, username);
  }

  function goBackHandler(): void {
    setView(<Home />);
  }

  return (
    <div className="view">
      <Card className="grow-10">
        <h3>Ange sessionens namn</h3>
        <Input
          type="text"
          maxLength={12}
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        />
        <p>Om din vän inte har en öppen session behöver någon av er skapa en</p>
        <h3>Välj ditt visningsnamn</h3>
        <Input
          type="text"
          maxLength={12}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Card>
      <Card className="big-text grow-1" onClick={joinSessionHandler}>
        Gå med
      </Card>
      <Card className="big-text grow-1" onClick={goBackHandler}>
        Tillbaka
      </Card>
    </div>
  );
}
