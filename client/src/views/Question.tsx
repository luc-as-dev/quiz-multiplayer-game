import React, { ReactNode } from "react";
import { SessionContextType } from "../@types/Session";
import Answers from "../components/Answers";
import Card from "../components/Card";
import FlipCard from "../components/FlipCard";
import useSession from "../hooks/useSession";

type Props = {
  children?: ReactNode;
};

export default function Question({}: Props) {
  const { getQuestion }: SessionContextType = useSession();

  return (
    <div className="view">
      <FlipCard className="medium-text grow-10" interactable={true}>
        <>{getQuestion()?.question}</>
        <>{getQuestion()?.answers}</>
      </FlipCard>
      {getQuestion() && <Answers answers={getQuestion()!.answers} />}
    </div>
  );
}
