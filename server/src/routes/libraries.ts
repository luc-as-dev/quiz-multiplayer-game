import { Router, Request, Response } from "express";
import { quizServer } from "../index";

export const router = Router();

// Get names of all libraries.
router.get("/libraries", (_, res: Response) => {
  res.send(quizServer.libraries.map((library) => library.name));
});

// Get Library info
//
router.get("/libraries/:name", async (req: Request, res: Response) => {
  const name = req.params.name;
  const library = quizServer.libraries.find((l) => l.name === name);
  res.send(await library.info());
});
