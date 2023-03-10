import logo from "../assets/logo.png";
import React, { useContext } from "react";
import Card from "../components/Card";
import FlipCard from "../components/FlipCard";
import { SetViewContext } from "../App";
import NewGame from "./NewGame";

type Props = {};

export default function Home({}: Props) {
  const setView = useContext(SetViewContext);

  return (
    <div className="home-container">
      <FlipCard className="logo-flip-card" interactable={true}>
        <img src={logo} />
        <div className="game-info">
          <h2>Utmana dina vänner i Quiz</h2>
          <p>
            Tryck "Nytt Spel" för att skapa en ny session som du sedan kan bjuda
            in vänner till.
          </p>
          <p>
            Tryck "Gå Med" för att ansluta till din väns spel, du behöver ett
            sessions id från din vän.
          </p>
        </div>
      </FlipCard>
      <Card
        className="new-game-card"
        onClick={() => {
          setView(<Home />);
        }}
      >
        <div>Nytt Spel</div>
      </Card>
      <Card className="join-game-card">
        <div>Gå Med</div>
      </Card>
    </div>
  );
}
