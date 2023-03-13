import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SessionProvider from "./context/SessionContext";
import ViewProvider from "./context/ViewContext";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SessionProvider
      serverURL={import.meta.env.VITE_SOME_SERVER_URL}
      updateMS={import.meta.env.VITE_SOME_UPDATE_INTERVAL}
    >
      <ViewProvider>
        <App />
      </ViewProvider>
    </SessionProvider>
  </React.StrictMode>
);
