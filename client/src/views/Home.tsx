import logo from "../assets/logo.png";
import React from "react";
import Card from "../components/Card";
import FlipCard from "../components/FlipCard";
import NewSession from "./NewSession";
import { useViewContext } from "../context/ViewContext";
import { ViewContextType } from "../@types/View";

type Props = {};

export default function Home({}: Props) {
  const { setView }: ViewContextType = useViewContext();

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
      <Card
        className="big-text grow-1"
        onClick={() => {
          setView(<NewSession />);
        }}
      >
        <div>Ny session</div>
      </Card>
      <Card className="big-text grow-1">
        <div>Gå med</div>
      </Card>
    </div>
  );
}
