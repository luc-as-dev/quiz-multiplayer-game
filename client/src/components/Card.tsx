import React, { MouseEventHandler, ReactNode, useState } from "react";
import NewGame from "../views/NewGame";

type Props = {
  className?: string | undefined;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  children?: ReactNode | undefined;
};

export default function Card({ className, onClick, children }: Props) {
  return (
    <div
      className={`card ${className || ""}`}
      onClick={onClick ? onClick : undefined}
      style={onClick ? { cursor: "pointer" } : {}}
    >
      {children}
    </div>
  );
}
