import express, { Express } from "express";
import { config } from "dotenv";
import cors from "cors";

import { router as gameRouter } from "./routes/game";
import { router as librariesRouter } from "./routes/libraries";
import QuizServer from "./quiz/QuizServer";
import MemoryLibrary from "./question-libraries/MemoryLibrary";
import { ICategory, IDifficulty, IQuestion } from "./@types/QuizServer";

config();

const PORT: number = +process.env.PORT || 3000;
const ORIGIN: string = process.env.ORIGIN || "*";
const UPDATE_INTERVAL = +process.env.UPDATE_INTERVAL || 1000;

const app: Express = express();

const EXAMPLE_CATEGORY: ICategory = { name: "Exempel Frågor" };
const EXAMPLE_DIFFICULTY: IDifficulty = { name: "Lätt", multiplier: 1 };
const EXAMPLE_QUESTION: IQuestion[] = [
  {
    category: EXAMPLE_CATEGORY.name,
    difficulty: EXAMPLE_DIFFICULTY.name,
    question: "Tycker du om Quiz?",
    correctAnswer: "Ja",
    incorrectAnswers: ["Nej", "Kanske", "Ibland"],
  },
  {
    category: EXAMPLE_CATEGORY.name,
    difficulty: EXAMPLE_DIFFICULTY.name,
    question: "Tycker du att det behövs fler frågor?",
    correctAnswer: "Nej",
    incorrectAnswers: ["Ja", "Kanske", "Ibland"],
  },
  {
    category: EXAMPLE_CATEGORY.name,
    difficulty: EXAMPLE_DIFFICULTY.name,
    question: "Vilken kategori av frågor vill du ha?",
    correctAnswer: "Bilar",
    incorrectAnswers: ["Hästar", "Vetenskap", "Natur"],
  },
];

const memoryLibrary = new MemoryLibrary("Example Library");
memoryLibrary.addCategory(EXAMPLE_CATEGORY);
memoryLibrary.addDifficulty(EXAMPLE_DIFFICULTY);
memoryLibrary.addQuestion(EXAMPLE_QUESTION[0]);
memoryLibrary.addQuestion(EXAMPLE_QUESTION[1]);
memoryLibrary.addQuestion(EXAMPLE_QUESTION[2]);

export const quizServer: QuizServer = new QuizServer(UPDATE_INTERVAL);
quizServer.addLibrary(memoryLibrary);

app.use(cors({ origin: ORIGIN }));
app.use(express.json());

app.use(gameRouter);
app.use(librariesRouter);

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});
