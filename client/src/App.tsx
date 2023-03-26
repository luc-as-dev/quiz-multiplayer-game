import "./App.scss";
import { useSearchParams } from "react-router-dom";
import SessionProvider from "./context/SessionContext";
import Game from "./Game";

export default function App() {
  const [searchParams] = useSearchParams();

  return (
    <SessionProvider
      serverURL={import.meta.env.VITE_SOME_SERVER_URL}
      localStorageKey={searchParams.get("localStorageKey") || undefined}
    >
      <div className="app">
        <Game />
      </div>
    </SessionProvider>
  );
}
