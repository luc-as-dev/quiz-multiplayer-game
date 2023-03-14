import React, { ReactNode, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { SessionContextType } from "../@types/Session";
import Answers from "../components/Answers";
import FlipCard from "../components/UI/FlipCard";
import useSession from "../hooks/useSession";

const QUESTION_WAIT = 500;

type Props = {
  children?: ReactNode;
};

export default function Question({}: Props) {
  const { getQuestion }: SessionContextType = useSession();
  const [showQuestion, setShowQuestion] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShowQuestion(true);
    }, QUESTION_WAIT);
  }, [getQuestion()]);

  function onAnswerHandler(answer: string) {
    setShowQuestion(false);
  }

  return (
    <div className="view">
      <FlipCard className="medium-text logo-card" flipped={showQuestion}>
        <img src={logo}></img>
        <>{getQuestion()?.question}</>
      </FlipCard>
      {getQuestion() && (
        <Answers onAnswer={onAnswerHandler} answers={getQuestion()!.answers} />
      )}
    </div>
  );
}
