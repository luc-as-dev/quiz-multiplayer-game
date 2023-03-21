import express, { Express } from "express";
import { config } from "dotenv";
import cors from "cors";

import { router as gameRouter } from "./routes/game";
import { router as librariesRouter } from "./routes/libraries";
import QuizServer from "./quiz/quizServer";
import { memoryLibraryFromJSON } from "./questionLibraries/memoryLibrary";
import MongoDBLibrary from "./questionLibraries/mongoDBLibrary";

import JSONLibrary from "./assets/JSONLibrary.json";

config();

const PORT: number = +process.env.PORT || 3000;
const ORIGIN: string = process.env.ORIGIN || "*";
const UPDATE_INTERVAL = +process.env.UPDATE_INTERVAL || 1000;

const app: Express = express();

export const quizServer: QuizServer = new QuizServer(UPDATE_INTERVAL);
quizServer.addLibrary(memoryLibraryFromJSON("JSONLibrary", JSONLibrary));

if (process.env.MONGO_URI) {
  const mongoDBLibrary = new MongoDBLibrary(
    "MongoDBLibrary",
    process.env.MONGO_URI
  );
  quizServer.addLibrary(mongoDBLibrary);
}

app.use(cors({ origin: ORIGIN }));
app.use(express.json());

app.use(gameRouter);
app.use(librariesRouter);

app.listen(PORT, () => {
  console.log(`Express: Started server on port ${PORT}`);
});
