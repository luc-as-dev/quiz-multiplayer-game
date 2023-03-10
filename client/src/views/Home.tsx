import logo from "../assets/logo.png";
import React from "react";
import Card from "../components/Card";
import FlipCard from "../components/FlipCard";

type Props = {};

export default function Home({}: Props) {
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
      <FlipCard className="new-game-flip-card" interactable={true}>
        <div>Nytt Spel</div>
        <div>Back</div>
      </FlipCard>
      <FlipCard className="join-game-flip-card" interactable={true}>
        <div>Gå Med</div>
        <div>Back</div>
      </FlipCard>
    </div>
  );
}
