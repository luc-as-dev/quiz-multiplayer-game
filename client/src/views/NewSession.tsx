import React, { useState } from "react";
import { SessionContextType } from "../@types/Session";
import { ViewContextType } from "../@types/View";
import Card from "../components/UI/Card/Card";
import Input from "../components/UI/Input/Input";
import { useViewContext } from "../context/ViewContext";
import useSession from "../hooks/useSession";
import Home from "./Home";

type Props = {};

function randomName(): string {
  return Math.random().toString().substring(2, 14);
}

export default function NewSession({}: Props) {
  const { setView }: ViewContextType = useViewContext();
  const { createSession }: SessionContextType = useSession();
  const [sessionName, setSessionName] = useState<string>(randomName());
  const [username, setUsername] = useState<string>("");

  function createSessionHandler(): void {
    createSession(sessionName, username);
  }

  function goBackHandler(): void {
    setView(<Home />);
  }

  return (
    <div className="view ">
      <Card className="grow-10">
        <h3>Välj ett namn för sessionen</h3>
        <Input
          type="text"
          maxLength={12}
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        />
        <p>
          Detta är det som dina vänner använder för att ansluta till din session
        </p>
        <h3>Välj ditt visningsnamn</h3>
        <Input
          type="text"
          maxLength={12}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Card>
      <Card className="big-text grow-1" onClick={createSessionHandler}>
        Skapa session
      </Card>
      <Card className="big-text grow-1" onClick={goBackHandler}>
        Tillbaka
      </Card>
    </div>
  );
}
