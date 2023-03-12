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
      id: game.id,
      updatedAt: game.updatedAt,
      stage: game.stage,
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
        id: game.id,
        players: game.getPlayers(),
        gameOn: game.gameOn,
        updatedAt: game.updatedAt,
        stage: game.stage,
      });
    }
  } else {
    res.status(400).send();
  }
});

router.post("/game/leave", (req: Request, res: Response) => {
  const { id, username } = req.body;

  if (id && username) {
    const game: Game = GameManager.findGameById(id);

    if (game && game.findUserByName(username)) {
      game.removeUser(username);

      res.send();
    }
  } else {
    res.status(400).send();
  }
});

// Ping game, get updatedAt
// body {id, username}
router.post("/game/ping", (req: Request, res: Response) => {
  const { id, username } = req.body;
  if (id && username) {
    const game: Game = GameManager.findGameById(id);
    if (game) {
      const user = game.findUserByName(username);

      if (user) {
        const updatedAt = game.ping(user);
        res.send({ updatedAt });
      }
    } else {
      res.status(400).send();
    }
  }
});

// Update session.
// body {id, username}
router.post("/game/update", (req: Request, res: Response) => {
  const { id, username } = req.body;

  if (id && username) {
    const game: Game = GameManager.findGameById(id);

    if (game) {
      const user = game.findUserByName(username);

      if (user) {
        res.send({
          username: user.getName(),
          id: game.id,
          isOwner: game.isOwner(user),
          players: game.getPlayers(),
          updatedAt: game.updatedAt,
          stage: game.stage,
        });
      }
    }
  } else {
    res.status(400).send();
  }
});

// Get current question
// body {id, username}
router.post("/game/question", async (req: Request, res: Response) => {
  const { id, username } = req.body;

  if (id && username) {
    const game: Game = GameManager.findGameById(id);
    if (game) {
      const user = game.findUserByName(username);
      if (user) {
        await game.waitQuestion((question: any) => {
          res.send(question);
        });
        return;
      }
    }
    res.status(400).send();
  } else {
    res.status(400).send();
  }
});

// Set question to next question
// body {id, username}
router.post("/game/next", (req: Request, res: Response) => {
  const { id, username } = req.body;

  if (id && username) {
    const game: Game = GameManager.findGameById(id);

    if (game) {
      const user = game.findUserByName(username);
      if (user && game.isOwner(user)) {
        game.next();
      }
    }
    res.send();
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
