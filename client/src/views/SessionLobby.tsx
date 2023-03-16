import React, { useEffect, useState } from "react";
import { ILibrary } from "../@types/QuizClient";
import { SessionContextType } from "../@types/Session";
import Card from "../components/UI/Card";
import DropDown from "../components/UI/DropDown";
import useSession from "../hooks/useSession";

type Props = {};

export default function SessionLobby({}: Props) {
  const session: SessionContextType = useSession();

  const [libraries, setLibraries] = useState<string[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<string>("");
  const [library, setLibrary] = useState<ILibrary | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  useEffect(() => {
    async function loadLibraries() {
      const libraries = await session.getLibraries();
      setLibraries(libraries);
      setSelectedLibrary(libraries[0]);
    }
    loadLibraries();
  }, []);

  useEffect(() => {
    async function loadLibrary(name: string) {
      const library = await session.getLibrary(name);
      if (library) {
        setLibrary(library);
        setSelectedCategory(library.categories[0]);
        setSelectedDifficulty(library.difficulties[0]);
      }
    }
    if (selectedLibrary !== "") loadLibrary(selectedLibrary);
  }, [selectedLibrary]);

  function startGameHandler() {
    if (session.hasSession() && session.getIsOwner()) {
      session.startSession(
        selectedLibrary,
        selectedCategory,
        selectedDifficulty
      );
    }
  }

  function leaveSessionHandler() {
    session.leaveSession();
  }

  return (
    <div className="view">
      <Card className="grow-10">
        <p className="medium-text">Session {session.getId()}</p>
        <div className="flex-wrap">
          <p>Deltagare:</p>
          {session.getPlayers()?.map((player) => (
            <p key={player}>{player}</p>
          ))}
        </div>

        <DropDown
          selected={selectedLibrary || ""}
          alternatives={libraries}
          setSelected={setSelectedLibrary}
          readonly={!session.getIsOwner()}
        />

        {library && (
          <DropDown
            selected={selectedCategory}
            alternatives={library?.categories}
            setSelected={setSelectedCategory}
            readonly={!session.getIsOwner()}
          />
        )}
        {library && (
          <DropDown
            selected={selectedDifficulty}
            alternatives={library?.difficulties}
            setSelected={setSelectedDifficulty}
            readonly={!session.getIsOwner()}
          />
        )}
      </Card>
      {session.getIsOwner() && (
        <Card className="big-text grow-1" onClick={startGameHandler}>
          Starta
        </Card>
      )}
      <Card className="big-text grow-1" onClick={leaveSessionHandler}>
        Tillbaka
      </Card>
    </div>
  );
}
