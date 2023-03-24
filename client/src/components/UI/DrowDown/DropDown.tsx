import React, { useState } from "react";
import "./DropDown.scss";

type Props = {
  selected: string;
  alternatives: string[];
  setSelected: (name: string) => void;
  readonly?: boolean;
};

export default function DropDown({
  selected,
  alternatives,
  setSelected,
  readonly = false,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function openHandler() {
    if (!readonly) setIsOpen((isOpen) => !isOpen);
  }

  function selectHandler(name: string) {
    setSelected(name);
  }

  return (
    <div
      className={`drop-down ${isOpen ? "open" : readonly ? "readonly" : ""}`}
      onClick={openHandler}
    >
      <div className="drop-down-head">{selected}</div>
      <div className={"drop-down-list"}>
        {alternatives.map((name) => (
          <div
            className={`drop-down-list-item ${
              name === selected ? "selected" : ""
            }`}
            onClick={() => selectHandler(name)}
            key={name}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
