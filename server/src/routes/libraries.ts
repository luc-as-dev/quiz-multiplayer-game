import { Router, Request, Response } from "express";
import { quizServer } from "../index";

export const router = Router();

// Get names of all libraries.
router.get("/libraries", (_, res: Response) => {
  res.send(quizServer.libraries.map((library) => library.name));
});
