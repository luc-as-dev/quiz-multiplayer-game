import React from "react";
import { ISessionInfo } from "../../../@types/QuizClient";
import "./SessionsList.scss";

type Props = {
  className?: string | undefined;
  sessionInfos: ISessionInfo[];
  selectedId: string | null;
  setSelectedId: Function;
};

export default function SessionsList({
  className,
  sessionInfos,
  selectedId,
  setSelectedId,
}: Props) {
  return (
    <div className={`session-list ${className || ""}`}>
      {sessionInfos.length > 0
        ? sessionInfos.map((sessionInfo: ISessionInfo) => (
            <div
              className={`session-list-item ${
                selectedId === sessionInfo.id ? "selected" : ""
              }`}
              onClick={() => setSelectedId(sessionInfo.id)}
              key={sessionInfo.id}
            >
              <div>{sessionInfo.id}</div>
              <div>{sessionInfo.owner}</div>
            </div>
          ))
        : "Det finns inga öppna sessioner"}
    </div>
  );
}
