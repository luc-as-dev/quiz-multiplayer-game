import React, { createContext, ReactNode, useEffect, useState } from "react";
import { SessionContextType } from "./@types/Session";
import { ViewContextType } from "./@types/View";
import "./App.scss";
import { useViewContext } from "./context/ViewContext";
import useSession from "./hooks/useSession";
import Home from "./views/Home";
import Question from "./views/Question";

export default function App() {
  const { view, isEntering, isExiting, setView }: ViewContextType =
    useViewContext();
  const { getSession, hasSession }: SessionContextType = useSession();

  useEffect(() => {
    setView(<Home />);
  }, []);

  useEffect(() => {
    console.log(getSession());
    if (getSession()) {
      if (getSession()!.stage.toString() === "1") {
        setView(<Question />);
      }
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
