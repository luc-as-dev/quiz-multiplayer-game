import React, { useState } from "react";
import { SessionContextType } from "../@types/Session";
import { ViewContextType } from "../@types/View";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Divider from "../components/UI/Divider";
import { useViewContext } from "../context/ViewContext";
import useSession from "../hooks/useSession";
import Home from "./Home";
import SearchSession from "./SearchSession";

type Props = {
  sessionId?: string | undefined;
};

export default function JoinSession({ sessionId }: Props) {
  const { setView }: ViewContextType = useViewContext();
  const { joinSession }: SessionContextType = useSession();
  const [sessionName, setSessionName] = useState<string>(sessionId || "");
  const [username, setUsername] = useState<string>("");

  function searchSessionsHandler(): void {
    setView(<SearchSession />);
  }

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
        <p>Be din vän dela sitt sessions namn</p>
        <h3>Välj ditt visningsnamn</h3>
        <Input
          type="text"
          maxLength={12}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Divider />
        <Button onClick={searchSessionsHandler}>Sök öppna sessioner</Button>
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
