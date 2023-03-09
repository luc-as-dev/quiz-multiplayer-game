import express, { Express } from "express";
import { config } from "dotenv";
import cors from "cors";

config();

const PORT: number = +process.env.PORT || 3000;
const ORIGIN: string = process.env.ORIGIN || "*";

const app: Express = express();

app.use(cors({ origin: ORIGIN }));

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});
