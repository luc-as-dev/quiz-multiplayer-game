import React from "react";
import { SessionContextType } from "../@types/Session";
import useSession from "../hooks/useSession";
import Card from "./Card";

type Props = {
  answers: string[];
};

export default function Answers({ answers }: Props) {
  const { sendAnswer }: SessionContextType = useSession();

  return (
    <div className="two-column grow-1">
      {answers.map((answer: string, index: number) => (
        <Card key={index} onClick={() => sendAnswer(answer)}>
          {answer}
        </Card>
      ))}
    </div>
  );
}
