import React, { MouseEventHandler, ReactNode } from "react";

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
