import React, { MouseEventHandler, ReactNode } from "react";
import "./Button.scss";

type Props = {
  children: ReactNode;
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function Button({ children, className, onClick }: Props) {
  return (
    <button className={`button ${className || ""}`} onClick={onClick}>
      {children}
    </button>
  );
}
