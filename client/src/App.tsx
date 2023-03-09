import React from "react";
import "./App.scss";
import Home from "./views/Home";

export default function App() {
  window.scrollTo(0, 1);
  return (
    <div className="app-container">
      <Home />
    </div>
  );
}
