import React, { useState } from "react";
import { createSessionResponseType } from "../@types/QuizAPI";
import { SessionContextType } from "../@types/Session";
import { ViewContextType } from "../@types/View";
import { createSession } from "../api/QuizAPI";
import Card from "../components/Card";
import Input from "../components/Input";
import { useSessionContext } from "../context/SessionContext";
import { useViewContext } from "../context/ViewContext";
import Home from "./Home";
import SessionLobby from "./SessionLobby";

type Props = {};

function randomName(): string {
  return Math.random().toString().substring(2, 14);
}

export default function NewSession({}: Props) {
  const { setView }: ViewContextType = useViewContext();
  const { setSession }: SessionContextType = useSessionContext();
  const [sessionName, setSessionName] = useState<string>(randomName());
  const [username, setUsername] = useState<string>("");

  async function createSessionHandler(): Promise<void> {
    const session: createSessionResponseType | undefined = await createSession(
      sessionName,
      username
    );
    if (session) {
      setSession({
        id: session.gameId,
        username: session.username,
        isOwner: true,
        players: { [session.username]: "" },
        gameOn: false,
        updatedAt: session.updatedAt,
      });
      setView(<SessionLobby />);
    }
    console.log(session);
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
