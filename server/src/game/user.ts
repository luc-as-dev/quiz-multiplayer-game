export default class User {
  private name: string;
  private score: number;
  constructor(name: string) {
    this.name = name;
    this.score = 0;
  }

  public setName(name: string): string {
    this.name = name;
    return this.name;
  }

  public getName(): string {
    return this.name;
  }

  public addScore(value: number): number {
    this.score += value;
    return this.score;
  }

  public getScore(): number {
    return this.score;
  }
}
