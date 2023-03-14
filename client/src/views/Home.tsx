import logo from "../assets/logo.png";
import React from "react";
import Card from "../components/UI/Card";
import FlipCard from "../components/UI/FlipCard";
import NewSession from "./NewSession";
import { useViewContext } from "../context/ViewContext";
import { ViewContextType } from "../@types/View";
import JoinSession from "./JoinSession";

type Props = {};

export default function Home({}: Props) {
  const { setView }: ViewContextType = useViewContext();

  function newSessionHandler(): void {
    setView(<NewSession />);
  }

  function joinSessionHandler(): void {
    setView(<JoinSession />);
  }

  return (
    <div className="view home-container">
      <FlipCard className="logo-card" interactable={true}>
        <img src={logo} />
        <>
          <h2>Utmana dina vänner i Quiz</h2>
          <p>
            Tryck "Ny session" för att skapa en ny session som du sedan kan
            bjuda in vänner till.
          </p>
          <p>
            Tryck "Gå med" för att ansluta till din väns spel, du behöver ett
            sessions id från din vän.
          </p>
        </>
      </FlipCard>
      <Card className="big-text grow-1" onClick={newSessionHandler}>
        <div>Ny session</div>
      </Card>
      <Card className="big-text grow-1" onClick={joinSessionHandler}>
        <div>Gå med</div>
      </Card>
    </div>
  );
}
