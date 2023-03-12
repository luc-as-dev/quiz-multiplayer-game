import { Game } from "./game";

export class GameManager {
  public static updateInterval: number = 1000;
  private static loop: NodeJS.Timer = null;
  private static games: { [key: string]: Game } = {};
  private static activeGames: Game[] = [];
  public static doLog: boolean = true;

  public static addGame(game: Game): boolean {
    if (!GameManager.games[game.id]) {
      console.log(`GameManager: Added game ${game.id}`);
      GameManager.games[game.id] = game;
      if (GameManager.loop === null) {
        GameManager.start();
      }
      return true;
    }
    return false;
  }

  public static removeGame(game: Game): boolean {
    if (GameManager.doLog) console.log(`GameManager: Removing game ${game.id}`);
    if (!game.gameOn && GameManager.games[game.id]) {
      delete GameManager.games[game.id];
      if (Object.keys(GameManager.games).length === 0) {
        GameManager.stop();
      }
      return true;
    }
    return false;
  }

  public static findGameById(id: string): Game | undefined {
    return GameManager.games[id];
  }

  private static update(): void {
    Object.values(GameManager.games).forEach((game: Game) => {
      game.update();
    });
  }

  private static start(): void {
    if (GameManager.doLog) console.log("GameManager: Starting interval");
    GameManager.loop = setInterval(
      GameManager.update,
      GameManager.updateInterval
    );
  }

  private static stop(): void {
    if (GameManager.doLog) console.log("GameManager: Stopping interval");
    clearInterval(GameManager.loop);
    GameManager.loop = null;
  }
}
