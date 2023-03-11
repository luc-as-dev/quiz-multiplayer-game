import React, { createContext, ReactNode, useContext, useState } from "react";
import { ViewContextType } from "../@types/View";

const EXIT_TIME: number = 250;
const ENTER_TIME: number = 250;

const ViewContext = createContext<ViewContextType>({
  view: undefined,
  isEntering: false,
  isExiting: false,
  setView: (view: ReactNode) => undefined,
});

type Props = {
  children: ReactNode;
};

export default function ViewProvider({ children }: Props) {
  const [activeView, setActiveView] = useState<ReactNode>(undefined);
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  function setView(view: ReactNode) {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      setActiveView(view);
      setIsEntering(true);
      setTimeout(() => {
        setIsEntering(false);
      }, ENTER_TIME);
    }, EXIT_TIME);
  }

  return (
    <ViewContext.Provider
      value={{ view: activeView, isEntering, isExiting, setView }}
    >
      {children}
    </ViewContext.Provider>
  );
}

export const useViewContext: Function = (): ViewContextType =>
  useContext<ViewContextType>(ViewContext);
