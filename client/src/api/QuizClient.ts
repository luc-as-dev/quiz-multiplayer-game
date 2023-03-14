import { IGameInfo, ISession } from "../@types/QuizClient";

const DEFAULT_UPDATE_TIME = 1000;
const LOCAL_STORAGE_KEY = "quiz";
type LOCAL_STORAGE_TYPE = { id: string; username: string };

export class QuizClient {
  private session: ISession | null = null;
  private serverURL: string;
  private setSessionCallback: Function | null;
  private updateInterval: number | null = null;
  private updateTime: number;

  private setAvailableSessionCallback: Function | null;
  private availableSessions: IGameInfo[] = [];
  private searchUpdateInterval: number | null = null;

  constructor(
    serverURL: string,
    setSession: Function,
    setAvailableSessions: Function,
    updateMS?: number
  ) {
    this.serverURL = serverURL;
    this.updateTime = updateMS || DEFAULT_UPDATE_TIME;
    this.setSessionCallback = setSession || null;
    this.setAvailableSessionCallback = setAvailableSessions;
  }

  private setSession(session: ISession | null): void {
    this.session = session;
    if (this.setSessionCallback) {
      this.setSessionCallback(session);
    }
    if (!this.updateInterval && session) {
      this.start();
    } else if (this.updateInterval && !session) {
      this.stop();
    }
  }

  private setAvailableSessions(gameInfos: IGameInfo[]): void {
    this.availableSessions = gameInfos;
    if (this.setAvailableSessionCallback) {
      this.setAvailableSessionCallback(this.availableSessions);
    }
  }

  private localClear(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  private localSave(): void {
    if (this.session) {
      const { id, username } = this.session!;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ id, username }));
    }
  }

  private async localLoad(): Promise<void> {
    const localStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localStr) {
      const { id, username }: LOCAL_STORAGE_TYPE = JSON.parse(localStr);
      if (await this.updateSession(id, username)) {
        this.start();
      } else {
        this.localClear();
      }
    }
  }

  private stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.localClear();
  }

  private update() {
    this.pingSession();
  }

  private start() {
    this.localSave();
    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => {
        this.update();
      }, this.updateTime);
    }
  }

  public getSession(): ISession | null {
    return this.session;
  }

  public getSessionSearch(): IGameInfo[] {
    return this.availableSessions;
  }

  public isSearchingSessions(): boolean {
    return this.searchUpdateInterval !== null;
  }

  public stopSessionSearch(): boolean {
    if (this.searchUpdateInterval) {
      clearInterval(this.searchUpdateInterval);
      this.searchUpdateInterval = null;
      return true;
    }
    return false;
  }

  private async updateSessionSearch(): Promise<void> {
    this.setAvailableSessions(await this.getSessions());
  }

  public startSessionSearch(): boolean {
    if (!this.searchUpdateInterval) {
      this.searchUpdateInterval = setInterval(() => {
        this.updateSessionSearch();
      }, this.updateTime);
      return true;
    }
    return false;
  }

  private async fetch(path: string, body?: {}): Promise<Response | null> {
    try {
      const response: Response = await fetch(`${this.serverURL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        return response;
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  public async isSessionIdAvailable(id: string) {
    const body = { id };
    const response: Response | null = await this.fetch("/game/checkId", body);
    if (response) return true;
    return false;
  }

  public async getSessions(): Promise<IGameInfo[]> {
    const response: Response | null = await this.fetch("/game/sessions");
    if (response) {
      return await response.json();
    }
    return [];
  }

  public async createSession(id: string, username: string) {
    const body = { id, username };
    const response: Response | null = await this.fetch("/game/create", body);
    if (response) {
      this.setSession(await response.json());
      return true;
    }
    return false;
  }

  public async joinSession(id: string, username: string): Promise<boolean> {
    const body = { id, username };
    const response: Response | null = await this.fetch("/game/join", body);
    if (response) {
      this.setSession(await response.json());
      return true;
    }
    return false;
  }

  public async leaveSession(force?: boolean): Promise<boolean> {
    if (!this.session) return false;
    const body = { id: this.session.id, username: this.session.username };
    const response: Response | null = await this.fetch("/game/leave", body);
    if (response) {
      this.setSession(null);
      return true;
    } else if (force) {
      this.setSession(null);
      return true;
    }
    return false;
  }

  public async updateSession(id?: string, username?: string): Promise<boolean> {
    const body = {
      id: id || this.session?.id,
      username: username || this.session?.username,
    };
    const response: Response | null = await this.fetch("/game/update", body);
    if (response) {
      this.setSession(await response.json());
      return true;
    }
    return false;
  }

  public async pingSession(): Promise<boolean> {
    if (!this.session) return false;
    const body = { id: this.session.id, username: this.session.username };
    const response: Response | null = await this.fetch("/game/ping", body);
    if (response) {
      const { updatedAt } = await response.json();
      if ((updatedAt - this.session!.updatedAt) / 1000 > 0) {
        console.log("Session has an updated");
        this.updateSession();
      }
      return true;
    }
    console.log("Could not ping server...");
    return false;
  }

  public async startSession(): Promise<boolean> {
    if (!this.session) return false;
    const body = { id: this.session.id, username: this.session.username };
    const response: Response | null = await this.fetch("/game/start", body);
    if (response) {
      return true;
    }
    return false;
  }

  public async sendAnswer(answer: string): Promise<boolean> {
    console.log("Sending Answer");
    if (!this.session) return false;
    const body = {
      id: this.session.id,
      username: this.session.username,
      answer,
    };
    const response: Response | null = await this.fetch("/game/answer", body);
    if (response) {
      return true;
    }
    return false;
  }
}
