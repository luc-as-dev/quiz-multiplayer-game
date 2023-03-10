import React, { createContext, ReactNode, useState } from "react";
import "./App.scss";
import Home from "./views/Home";

export const SetViewContext: React.Context<Function> = createContext<Function>(
  () => {}
);

const EXIT_TIME: number = 250;
const ENTER_TIME: number = 250;

export default function App() {
  const [activeView, setActiveView] = useState<ReactNode>(<Home />);
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  function setView(view: ReactNode) {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      setActiveView(view);
      setIsEntering(true);
      setTimeout(() => {
        setIsEntering(false);
      }, ENTER_TIME);
    }, EXIT_TIME);
  }

  return (
    <SetViewContext.Provider value={setView}>
      <div className="app">
        <div
          className={`view ${isEntering ? "" : isExiting ? "exit" : "active"}`}
        >
          {activeView}
        </div>
      </div>
    </SetViewContext.Provider>
  );
}
