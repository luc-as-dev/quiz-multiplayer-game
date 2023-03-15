import QuestionLibrary from "../question-libraries/QuestionLibrary";
import { IGameInfo, ILibrary } from "../@types/QuizServer";
import Game from "./Game";
import User from "./User";

export default class GameManager {
  public libraries: QuestionLibrary[];
  private updateTime: number;
  private updateInterval: NodeJS.Timer = null;
  private games: { [gameId: string]: Game } = {};
  private doLog: boolean = true;

  constructor(libraries: QuestionLibrary[], updateMS: number) {
    this.libraries = libraries;
    this.updateTime = updateMS;
  }

  public addGame(gameId: string, creator: User, time?: number): Game | null {
    if (!this.games[gameId]) {
      const game = new Game(this, gameId, creator, time);
      console.log(`GameManager: Added game ${game.id}`);

      this.games[game.id] = game;
      this.start();

      return game;
    }
    return null;
  }

  public removeGame(game: Game): boolean {
    if (this.doLog) console.log(`GameManager: Removing game ${game.id}`);
    if (this.games[game.id]) {
      delete this.games[game.id];
      if (Object.keys(this.games).length === 0) {
        this.stop();
      }
      return true;
    }
    return false;
  }

  public findGameById(id: string): Game | undefined {
    return this.games[id];
  }

  public findLibraryByName(name: string): QuestionLibrary | null {
    const library = this.libraries.find((l) => l.name === name);
    return library || null;
  }

  public getGamesInfo(): IGameInfo[] {
    const gameInfos: IGameInfo[] = [];
    Object.keys(this.games).forEach((gameId: string) => {
      const game: Game = this.games[gameId];
      gameInfos.push({
        gameId: game.id,
        players: Object.keys(game.getPlayers()),
        owner: game.getOwner().getName(),
      });
    });
    return gameInfos;
  }

  private update(): void {
    Object.values(this.games).forEach((game: Game) => {
      game.update();
    });
  }

  private start(): void {
    if (this.doLog) console.log("GameManager: Starting interval");
    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => this.update(), this.updateTime);
    }
  }

  private stop(): void {
    if (this.doLog) console.log("GameManager: Stopping interval");
    if (this.updateInterval) clearInterval(this.updateInterval);

    this.updateInterval = null;
  }
}
