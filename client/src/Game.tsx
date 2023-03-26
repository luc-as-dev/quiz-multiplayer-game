import { useEffect } from "react";
import { useViewContext } from "./context/ViewContext";
import useSession from "./hooks/useSession";
import Home from "./views/Home";
import SessionEnd from "./views/SessionEnd";
import SessionLobby from "./views/SessionLobby";
import SessionMiddle from "./views/SessionMiddle";
import SessionQuestion from "./views/SessionQuestion";

export default function Game() {
  const { view, isEntering, isExiting, setView } = useViewContext();
  const session = useSession();

  useEffect(() => {
    if (session.hasSession()) {
      const stage = session.getStage()!;
      console.log("Set view:", stage);
      if (stage === "lobby") {
        setView(<SessionLobby />);
      } else if (stage === "question") {
        setView(<SessionQuestion />);
      } else if (stage === "middle") {
        setView(<SessionMiddle />);
      } else if (stage === "end") {
        setView(<SessionEnd />);
      }
    } else {
      setView(<Home />);
    }
  }, [session.getStage()]);
  return (
    <div
      className={`views-container ${
        isEntering ? "" : isExiting ? "exit" : "active"
      }`}
    >
      {view && view}
    </div>
  );
}
