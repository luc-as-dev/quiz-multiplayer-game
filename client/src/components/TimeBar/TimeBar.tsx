import React, { useEffect, useState } from "react";
import "./TimeBar.scss";

type Props = {
  currentTime: number;
  maxTime: number;
};

export default function TimeBar({ currentTime, maxTime }: Props) {
  console.log(currentTime);
  return (
    <div className="time-bar">
      <div
        className="time-bar-fill"
        style={{ width: `${(currentTime / maxTime) * 100}%` }}
      ></div>
    </div>
  );
}
