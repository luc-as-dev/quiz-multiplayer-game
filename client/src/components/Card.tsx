import React, { ReactNode, useState } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

export default function Card({ className, children }: Props) {
  return <div className={`card ${className || ""}`}>{children}</div>;
}
