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

// Create a new session.
// body {id, username}
router.post("/game/create", (req: Request, res: Response) => {
  const { id, username } = req.body;

  if (id && username) {
    if (GameManager.findGameById(id)) {
      return res.status(400).send();
    }

    const user: User = new User(username);
    const game: Game = new Game(id, user);

    GameManager.addGame(game);

    res.send({
      username: user.getName(),
      gameId: game.id,
      updatedAt: game.updatedAt,
    });
  } else {
    res.status(400).send();
  }
});

// Join session.
// body {id, username}
router.post("/game/join", (req: Request, res: Response) => {
  const { id, username } = req.body;

  if (id && username) {
    const game: Game = GameManager.findGameById(id);

    if (game && !game.findUserByName(username)) {
      const user: User = new User(username);

      game.addUser(user);

      res.send({
        username: user.getName(),
        gameId: game.id,
        players: game.getPlayers(),
        gameOn: game.gameOn,
        updatedAt: game.updatedAt,
      });
    }
  } else {
    res.status(400).send();
  }
});

// Check if session id is available
// :id - session id
router.get("/game/checkId/:id", (req: Request, res: Response) => {
  const game: Game = GameManager.findGameById(req.params.id);
  if (!game) {
    res.send();
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
