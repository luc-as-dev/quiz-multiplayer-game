import { Router, Request, Response } from "express";

import Game from "../game/game";
import { IGameInfo, ISession, IUser } from "../@types/QuizServer";
import { quizServer } from "../index";
export const router = Router();

// Find available session.
// body {id, username}
router.post("/game/sessions", (_, res: Response) => {
  const gamesIds: IGameInfo[] = quizServer.manager.getGamesInfo();
  res.send(gamesIds);
});

// Create a new session.
// body {id, username}
router.post("/game/create", (req: Request, res: Response) => {
  const { id, username } = req.body;

  if (id && username) {
    const user: IUser = { name: username, score: 0 };
    const game: Game = quizServer.manager.addGame(id, user);
    const session: ISession = {
      id: game.id,
      username: user.name,
      isOwner: game.isOwner(user),
      players: game.getPlayers(),
      question: game.getQuestion(),
      updatedAt: game.updatedAt,
      stage: game.stage,
    };

    if (game) {
      res.send(session);
    } else {
      res.status(400).send();
    }
  } else {
    res.status(400).send();
  }
});

// Join session.
// body {id, username}
router.post("/game/join", (req: Request, res: Response) => {
  const { id, username } = req.body;

  if (id && username) {
    const game: Game = quizServer.manager.findGameById(id);

    if (game && !game.findUserByName(username)) {
      const user: IUser = { name: username, score: 0 };

      game.addUser(user);

      const session: ISession = {
        id: game.id,
        username: user.name,
        isOwner: game.isOwner(user),
        players: game.getPlayers(),
        question: game.getQuestion(),
        updatedAt: game.updatedAt,
        stage: game.stage,
      };

      res.send(session);
    }
  } else {
    res.status(400).send();
  }
});

// Leave session.
// body {id, username}
router.post("/game/leave", (req: Request, res: Response) => {
  const { id, username } = req.body;

  if (id && username) {
    const game: Game = quizServer.manager.findGameById(id);

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
    const game: Game = quizServer.manager.findGameById(id);

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
    const game: Game = quizServer.manager.findGameById(id);

    if (game) {
      const user = game.findUserByName(username);

      const session: ISession = {
        id: game.id,
        username: user.name,
        isOwner: game.isOwner(user),
        players: game.getPlayers(),
        question: game.getQuestion(),
        updatedAt: game.updatedAt,
        stage: game.stage,
      };

      if (user) {
        res.send(session);
      }
    }
  } else {
    res.status(400).send();
  }
});

// Send answer to current question
// body {id, username, answer}
router.post("/game/answer", async (req: Request, res: Response) => {
  const { id, username, answer } = req.body;

  if (id && username) {
    const game: Game = quizServer.manager.findGameById(id);

    if (game && game.findUserByName(username)) {
      game.saveAnswer(username, answer);
      return res.send();
    }
    res.status(400).send();
  } else {
    res.status(400).send();
  }
});

// Start game
// body {id, username}
router.post("/game/start", (req: Request, res: Response) => {
  const { id, username, library, category, difficulty } = req.body;

  if (id && username) {
    const game: Game = quizServer.manager.findGameById(id);

    if (game) {
      const user = game.findUserByName(username);

      if (user && game.isOwner(user)) {
        game.start(library, category, difficulty);
      }
    }
    res.send();
  } else {
    res.status(400).send();
  }
});

// Check if session id is available
// body {id}
router.post("/game/checkId", (req: Request, res: Response) => {
  const { id } = req.body;
  const game: Game = quizServer.manager.findGameById(id);

  if (!game) {
    res.send();
  } else {
    res.status(400).send();
  }
});
