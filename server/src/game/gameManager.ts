import { Game } from "./game";

export class GameManager {
  public static updateInterval: number = 1000;
  private static loop: NodeJS.Timer = null;
  private static games: { [key: string]: Game } = {};
  private static activeGames: Game[] = [];

  public static addGame(game: Game): boolean {
    console.log(`Added game: ${game.id}`);
    if (!GameManager.games[game.id]) {
      GameManager.games[game.id] = game;
      return true;
    }
    return false;
  }

  public static removeGame(game: Game): boolean {
    console.log(`Removing game: ${game.id}`);
    if (!game.gameOn && GameManager.games[game.id]) {
      delete GameManager.games[game.id];
      return true;
    }
    return false;
  }

  public static startGame(game: Game): void {
    console.log(`Starting game: ${game.id}`);
    GameManager.activeGames.push(game);
    if (GameManager.loop === null) {
      GameManager.start();
    }
  }

  public static stopGame(game: Game): void {
    console.log(`Stopping game: ${game.id}`);
    GameManager.activeGames.splice(GameManager.activeGames.indexOf(game));
    if (GameManager.activeGames.length === 0) {
      GameManager.stop();
    }
  }

  public static findGameById(id: string): Game | undefined {
    return GameManager.games[id];
  }

  private static update(): void {
    GameManager.activeGames.forEach((game: Game) => {
      game.update();
    });
  }

  private static start(): void {
    GameManager.loop = setInterval(
      GameManager.update,
      GameManager.updateInterval
    );
  }

  private static stop(): void {
    clearInterval(GameManager.loop);
    GameManager.loop = null;
  }
}
