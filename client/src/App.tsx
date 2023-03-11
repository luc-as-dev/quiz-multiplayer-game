import React, { createContext, ReactNode, useEffect, useState } from "react";
import { ViewContextType } from "./@types/View";
import "./App.scss";
import { useViewContext } from "./context/ViewContext";
import Home from "./views/Home";

export default function App() {
  const { view, isEntering, isExiting, setView }: ViewContextType =
    useViewContext();

  useEffect(() => {
    setView(<Home />);
  }, []);

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
