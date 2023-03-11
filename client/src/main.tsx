import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SessionProvider from "./context/SessionContext";
import ViewProvider from "./context/ViewContext";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SessionProvider>
      <ViewProvider>
        <App />
      </ViewProvider>
    </SessionProvider>
  </React.StrictMode>
);
