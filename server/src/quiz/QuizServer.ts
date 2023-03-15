import GameManager from "../game/GameManager";
import QuestionLibrary from "../question-libraries/QuestionLibrary";

const DEFAULT_UPDATE_TIME = 1000;

export default class QuizServer {
  manager: GameManager;
  libraries: QuestionLibrary[] = [];

  constructor(updateMS?: number) {
    this.manager = new GameManager(
      this.libraries,
      updateMS || DEFAULT_UPDATE_TIME
    );
  }

  public addLibrary(library: QuestionLibrary): boolean {
    this.libraries.push(library);
    return false;
  }
}
