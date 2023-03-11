import React, { ReactNode } from "react";
import Card from "../components/Card";

type Props = {
  children?: ReactNode;
};

export default function Question({}: Props) {
  return (
    <div className="view">
      <Card>Game on</Card>
    </div>
  );
}
