export type ViewContextType = {
  view: ReactNode | undefined;
  isEntering: boolean;
  isExiting: boolean;
  setView: (view: ReactNode) => void | undefined;
};
