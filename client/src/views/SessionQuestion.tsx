import React, { ReactNode, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { SessionContextType } from "../@types/Session";
import Answers from "../components/Answers";
import FlipCard from "../components/UI/FlipCard/FlipCard";
import useSession from "../hooks/useSession";
import TimeBar from "../components/UI/TimeBar/TimeBar";

const QUESTION_WAIT = 500;

type Props = {
  children?: ReactNode;
};

export default function SessionQuestion({}: Props) {
  const { getQuestion, getCurrentTime, getQuestionTimeS }: SessionContextType =
    useSession();
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
        <>
          {getQuestion()?.question}
          <TimeBar
            currentTime={getCurrentTime()!}
            maxTime={getQuestionTimeS()!}
          />
        </>
      </FlipCard>
      {getQuestion() && (
        <Answers
          onAnswer={onAnswerHandler}
          answers={getQuestion()!.answers}
          show={showQuestion}
        />
      )}
    </div>
  );
}
