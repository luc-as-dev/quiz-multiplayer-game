import React from "react";
import logo from "../assets/logo.png";

type Props = {};

export default function Home({}: Props) {
  return (
    <div className="home-container">
      <div className="logo-container">
        <img src={logo} />
      </div>
      <div className="new-game-container">Nytt Spel</div>
      <div className="join-game-container">Gå med</div>
    </div>
  );
}
