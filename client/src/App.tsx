import React, { createContext, ReactNode, useEffect, useState } from "react";
import { SessionContextType } from "./@types/Session";
import { ViewContextType } from "./@types/View";
import "./App.scss";
import { useViewContext } from "./context/ViewContext";
import useSession from "./hooks/useSession";
import Home from "./views/Home";
import Question from "./views/Question";
import SessionLobby from "./views/SessionLobby";

export default function App() {
  const { view, isEntering, isExiting, setView }: ViewContextType =
    useViewContext();
  const { getSession }: SessionContextType = useSession();

  useEffect(() => {
    if (getSession()) {
      const stage = getSession()!.stage;
      console.log("Set view:", stage);
      if (stage.toString() === "lobby") {
        setView(<SessionLobby />);
      } else if (stage.toString() === "end") {
      } else {
        setView(<Question />);
      }
    } else {
      setView(<Home />);
    }
  }, [getSession()?.stage]);

  return (
    <div className="app">
      <div
        className={`views-container ${
          isEntering ? "" : isExiting ? "exit" : "active"
        }`}
      >
        {view && view}
      </div>
    </div>
  );
}
