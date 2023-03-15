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

const EXAMPLE_CATEGORY_1: ICategory = { name: "Exempel Frågor 1" };
const EXAMPLE_CATEGORY_2: ICategory = { name: "Exempel Frågor 2" };
const EXAMPLE_CATEGORY_3: ICategory = { name: "Exempel Frågor 3" };
const EXAMPLE_CATEGORY_4: ICategory = { name: "Exempel Frågor 4" };
const EXAMPLE_CATEGORY_5: ICategory = { name: "Exempel Frågor 5" };
const EXAMPLE_CATEGORY_6: ICategory = { name: "Exempel Frågor 6" };
const EXAMPLE_CATEGORY_7: ICategory = { name: "Exempel Frågor 7" };
const EXAMPLE_CATEGORY_8: ICategory = { name: "Exempel Frågor 8" };
const EXAMPLE_DIFFICULTY: IDifficulty = { name: "Lätt", multiplier: 1 };
const EXAMPLE_DIFFICULTY_2: IDifficulty = { name: "Mellan", multiplier: 2 };
const EXAMPLE_DIFFICULTY_3: IDifficulty = { name: "Svår", multiplier: 3 };
const EXAMPLE_QUESTION: IQuestion[] = [
  {
    category: EXAMPLE_CATEGORY_1.name,
    difficulty: EXAMPLE_DIFFICULTY.name,
    question: "Tycker du om Quiz?",
    correctAnswer: "Ja",
    incorrectAnswers: ["Nej", "Kanske", "Ibland"],
  },
  {
    category: EXAMPLE_CATEGORY_1.name,
    difficulty: EXAMPLE_DIFFICULTY.name,
    question: "Tycker du att det behövs fler frågor?",
    correctAnswer: "Nej",
    incorrectAnswers: ["Ja", "Kanske", "Ibland"],
  },
  {
    category: EXAMPLE_CATEGORY_1.name,
    difficulty: EXAMPLE_DIFFICULTY.name,
    question: "Vilken kategori av frågor vill du ha?",
    correctAnswer: "Bilar",
    incorrectAnswers: ["Hästar", "Vetenskap", "Natur"],
  },
];

const memoryLibrary = new MemoryLibrary("Example Library");
memoryLibrary.addCategory(EXAMPLE_CATEGORY_1);
memoryLibrary.addCategory(EXAMPLE_CATEGORY_2);
memoryLibrary.addCategory(EXAMPLE_CATEGORY_3);
memoryLibrary.addCategory(EXAMPLE_CATEGORY_4);
memoryLibrary.addCategory(EXAMPLE_CATEGORY_5);
memoryLibrary.addCategory(EXAMPLE_CATEGORY_6);
memoryLibrary.addCategory(EXAMPLE_CATEGORY_7);
memoryLibrary.addCategory(EXAMPLE_CATEGORY_8);
memoryLibrary.addDifficulty(EXAMPLE_DIFFICULTY);
memoryLibrary.addDifficulty(EXAMPLE_DIFFICULTY_2);
memoryLibrary.addDifficulty(EXAMPLE_DIFFICULTY_3);
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
