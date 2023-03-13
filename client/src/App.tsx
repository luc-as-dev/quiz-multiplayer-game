import React, { useEffect } from "react";
import "./App.scss";
import { SessionContextType } from "./@types/Session";
import { ViewContextType } from "./@types/View";
import { useViewContext } from "./context/ViewContext";
import useSession from "./hooks/useSession";
import Home from "./views/Home";
import Question from "./views/Question";
import SessionEnd from "./views/SessionEnd";
import SessionLobby from "./views/SessionLobby";

export default function App() {
  const { view, isEntering, isExiting, setView }: ViewContextType =
    useViewContext();
  const session: SessionContextType = useSession();

  useEffect(() => {
    if (session.hasSession()) {
      const stage = session.getStage()!;
      console.log("Set view:", stage);
      if (stage.toString() === "lobby") {
        setView(<SessionLobby />);
      } else if (stage.toString() === "end") {
        setView(<SessionEnd />);
      } else {
        setView(<Question />);
      }
    } else {
      setView(<Home />);
    }
  }, [session.getStage()]);

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
