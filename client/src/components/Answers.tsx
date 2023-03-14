import React from "react";
import { SessionContextType } from "../@types/Session";
import useSession from "../hooks/useSession";
import Card from "./UI/Card";

type Props = {
  answers: string[];
  onAnswer: Function;
};

export default function Answers({ answers, onAnswer }: Props) {
  const { sendAnswer }: SessionContextType = useSession();

  function answerHandler(answer: string) {
    onAnswer(answer);
    sendAnswer(answer);
  }

  return (
    <div className="two-column grow-1">
      {answers.map((answer: string, index: number) => (
        <Card
          key={index}
          onClick={() => {
            answerHandler(answer);
          }}
        >
          {answer}
        </Card>
      ))}
    </div>
  );
}
