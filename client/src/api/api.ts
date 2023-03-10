const SERVER_URL = import.meta.env.VITE_SOME_SERVER_URL;

export async function isSessionIdAvailable(id: string): Promise<boolean> {
  try {
    const response: Response = await fetch(`${SERVER_URL}/game/checkId/${id}`);
    if (response.ok) {
      return true;
    }
  } catch (err) {}
  return false;
}

export type createSessionResponseType = {
  userName: string;
  gameId: string;
  updatedAt: number;
};

export async function createSession(
  id: string,
  username: string
): Promise<createSessionResponseType | undefined> {
  try {
    const response: Response = await fetch(`${SERVER_URL}/game`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, username }),
    });
    if (response.ok) {
      const data: createSessionResponseType = await response.json();
      return data;
    }
  } catch (err) {}
  return undefined;
}
