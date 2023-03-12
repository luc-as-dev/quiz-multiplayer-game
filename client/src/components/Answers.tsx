import React from "react";
import Card from "./Card";

type Props = {
  answers: string[];
};

export default function Answers({ answers }: Props) {
  return (
    <div className="two-column grow-1">
      {answers.map((answer: string, index: number) => (
        <Card key={index}>{answer}</Card>
      ))}
    </div>
  );
}
