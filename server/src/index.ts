import express, { Express } from "express";
import { config } from "dotenv";
import cors from "cors";

import { router as gameRouter } from "./routes/game";
import { GameManager } from "./game/gameManager";

config();

const PORT: number = +process.env.PORT || 3000;
const ORIGIN: string = process.env.ORIGIN || "*";
const UPDATE_INTERVAL = +process.env.UPDATE_INTERVAL || 1000;

const app: Express = express();

app.use(cors({ origin: ORIGIN }));
app.use(express.json());

app.use(gameRouter);

GameManager.updateInterval = UPDATE_INTERVAL;

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});
