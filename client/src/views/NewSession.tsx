import React, { useContext, useState } from "react";
import { SetViewContext } from "../App";
import Card from "../components/Card";
import Input from "../components/Input";
import Home from "./Home";

type Props = {};

export default function NewSession({}: Props) {
  const setView = useContext<Function>(SetViewContext);
  const [sessionName, setSessionName] = useState<string>(
    Math.random().toString().substring(2, 14)
  );

  return (
    <div className="view ">
      <Card className="grow-10">
        <h2>Välj ett namn för din session</h2>
        <Input
          type="text"
          maxLength={12}
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        />
        <p>
          Detta är det som dina vänner använder för att anslutat till din
          session
        </p>
      </Card>
      <Card className="big-text grow-1">Skapa session</Card>
      <Card
        className="big-text grow-1"
        onClick={() => {
          setView(<Home />);
        }}
      >
        Tillbaka
      </Card>
    </div>
  );
}
