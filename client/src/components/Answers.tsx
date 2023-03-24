import React from "react";
import { SessionContextType } from "../@types/Session";
import useSession from "../hooks/useSession";
import Card from "./UI/Card/Card";

type Props = {
  answers: string[];
  onAnswer: Function;
  show: boolean;
};

export default function Answers({ answers, onAnswer, show }: Props) {
  const { sendAnswer }: SessionContextType = useSession();

  function answerHandler(answer: string) {
    if (show) {
      onAnswer(answer);
      sendAnswer(answer);
    }
  }

  return (
    <div
      className="answer two-column grow-1"
      style={show ? {} : { opacity: 0 }}
    >
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
