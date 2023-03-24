import { config } from "dotenv";
import express, { Express } from "express";
import { createServer } from "http";
import cors from "cors";

import { memoryLibraryFromJSON } from "./classes/MemoryLibrary";
import MongoDBLibrary from "./classes/MongoDBLibrary";

import JSONLibrary from "./assets/JSONLibrary.json";
import QuizSocketServer from "./classes/QuizSocketServer";

config();

const PORT: number = +process.env.PORT || 3000;
const ORIGIN: string = process.env.ORIGIN || "*";

const app: Express = express();
const server = createServer(app);

export const quizServer: QuizSocketServer = new QuizSocketServer(server, {
  origin: "*",
});

quizServer.addLibrary(memoryLibraryFromJSON("JSONLibrary", JSONLibrary));

if (process.env.MONGO_URI) {
  const mongoDBLibrary = new MongoDBLibrary(
    "MongoDBLibrary",
    process.env.MONGO_URI
  );

  // TODO: Check success?
  quizServer.addLibrary(mongoDBLibrary);
}

app.use(cors({ origin: ORIGIN }));
app.use(express.json());

server.listen(PORT, () => {
  console.log(`Server : Listening on port ${PORT}`);
});
