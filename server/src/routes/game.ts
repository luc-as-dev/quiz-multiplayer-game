import { Router, Request, Response, response } from "express";

import {
  getCategories,
  CategoryType,
  getQuestionsCountByCategory,
  QuestionsCountType,
  QuestionsCountGlobalType,
  getQuestionsCountGlobal,
} from "../api/triviaAPI";
import { GameManager } from "../game/gameManager";
import { Game } from "../game/game";
import { User } from "../game/user";

export const router = Router();

router.get("/game/info/categories", async (_, res: Response) => {
  try {
    const categories: CategoryType[] = await getCategories();
    res.send(categories);
  } catch {
    res.status(500).send();
  }
});

router.get("/game/info/questions", async (_, res: Response) => {
  try {
    const count: QuestionsCountGlobalType = await getQuestionsCountGlobal();
    res.send(count);
  } catch {
    res.status(500).send();
  }
});

router.get("/game/info/questions/:id", async (req: Request, res: Response) => {
  try {
    const id: number = +req.params.id;
    const count: QuestionsCountType = await getQuestionsCountByCategory(id);
    res.send(count);
  } catch {
    res.status(400).send();
  }
});

router.post("/game", (req: Request, res: Response) => {
  const { id, userName, time } = req.body;
  if (id && userName && time) {
    const user = new User(userName);
    const game: Game = new Game(id, user, time);
    GameManager.addGame(game);
    res.send({ userName, gameId: game.id, updatedAt: game.updatedAt });
  } else {
    res.status(400).send();
  }
});

router.get("/game/check/:id", (req: Request, res: Response) => {
  const game: Game = GameManager.findGameById(req.params.id);
  if (game) {
    res.send(game.updatedAt);
  } else {
    res.status(400).send();
  }
});
