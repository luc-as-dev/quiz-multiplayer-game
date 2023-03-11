import React, { useContext } from "react";
import { SessionContextType } from "../@types/Session";
import { sessionContext } from "../context/SessionContext";

export default function useSession(): SessionContextType {
  const sessionCtx: SessionContextType | null = useContext(sessionContext);

  if (!sessionCtx) {
    throw new Error(
      "useSessionContext has to be used within <SessionProvider>"
    );
  }

  return sessionCtx!;
}
