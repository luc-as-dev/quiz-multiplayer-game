import { GameManager } from "./GameManager";

const DEFAULT_UPDATE_TIME = 1000;

export class QuizServer {
  manager: GameManager;

  constructor(updateMS?: number) {
    this.manager = new GameManager(updateMS || DEFAULT_UPDATE_TIME);
  }
}
