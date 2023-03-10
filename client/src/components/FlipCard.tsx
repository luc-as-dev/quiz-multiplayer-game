import { ReactNode, useState } from "react";
import Card from "./Card";

type Props = {
  children: [ReactNode, ReactNode];
  className?: string | undefined;
  interactable?: boolean | undefined;
};

export default function FlipCard({
  children: [front, back],
  className,
  interactable,
}: Props) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  function flip() {
    setIsFlipped((current) => !current);
  }

  return (
    <div
      className={`flip-card ${isFlipped ? "flipped" : ""} ${className || ""}`}
      onClick={interactable ? flip : undefined}
      style={interactable ? { cursor: "pointer" } : {}}
    >
      <div className="inner">
        <Card className="front">{front}</Card>
        <Card className="back">{back}</Card>
      </div>
    </div>
  );
}
