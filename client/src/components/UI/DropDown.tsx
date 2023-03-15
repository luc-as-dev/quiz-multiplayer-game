import React, { useState } from "react";

type Props = {
  selected: string;
  alternatives: string[];
  setSelected: (name: string) => void;
};

export default function DropDown({
  selected,
  alternatives,
  setSelected,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function openHandler() {
    setIsOpen((isOpen) => !isOpen);
  }

  function selectHandler(name: string) {
    setSelected(name);
  }

  return (
    <div className={`drop-down ${isOpen ? "open" : ""}`} onClick={openHandler}>
      <div className="d-head">{selected}</div>
      <div className={"d-list"}>
        {alternatives.map((name) => (
          <div
            className={`d-item ${name === selected ? "selected" : ""}`}
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
