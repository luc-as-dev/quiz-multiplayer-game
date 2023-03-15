import express, { Express } from "express";
import { config } from "dotenv";
import cors from "cors";

import { router as gameRouter } from "./routes/game";
import { QuizServer } from "./game/QuizServer";

config();

const PORT: number = +process.env.PORT || 3000;
const ORIGIN: string = process.env.ORIGIN || "*";
const UPDATE_INTERVAL = +process.env.UPDATE_INTERVAL || 1000;

const app: Express = express();
export const quizServer: QuizServer = new QuizServer(UPDATE_INTERVAL);

app.use(cors({ origin: ORIGIN }));
app.use(express.json());

app.use(gameRouter);

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});
