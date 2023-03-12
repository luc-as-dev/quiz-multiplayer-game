import {
  checkSessionResponseType,
  createSessionResponseType,
  joinSessionResponseType,
  questionResponseType,
  updateSessionResponseType,
} from "../@types/QuizAPI";

const SERVER_URL = import.meta.env.VITE_SOME_SERVER_URL;

export async function isSessionIdAvailable(id: string): Promise<boolean> {
  try {
    const response: Response = await fetch(`${SERVER_URL}/game/checkId/${id}`);
    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
  return false;
}

export async function createSessionFetch(
  id: string,
  username: string
): Promise<createSessionResponseType | undefined> {
  try {
    const response: Response = await fetch(`${SERVER_URL}/game/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, username }),
    });
    if (response.ok) {
      const data: createSessionResponseType = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
  return undefined;
}

export async function joinSessionFetch(
  id: string,
  username: string
): Promise<joinSessionResponseType | undefined> {
  try {
    const response: Response = await fetch(`${SERVER_URL}/game/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, username }),
    });
    if (response.ok) {
      const data: joinSessionResponseType = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
  return undefined;
}

export async function checkSessionFetch(
  id: string
): Promise<checkSessionResponseType> {
  try {
    const response: Response = await fetch(`${SERVER_URL}/game/check/${id}`, {
      method: "POST",
    });
    if (response.ok) {
      const data: checkSessionResponseType = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
  return { updatedAt: -1 };
}

export async function updateSessionFetch(
  id: string,
  username: string
): Promise<updateSessionResponseType | undefined> {
  try {
    const response: Response = await fetch(`${SERVER_URL}/game/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, username }),
    });
    if (response.ok) {
      const data: updateSessionResponseType = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
  return undefined;
}

export async function nextQuestionFetch(
  id: string,
  username: string
): Promise<boolean> {
  try {
    const response: Response = await fetch(`${SERVER_URL}/game/next`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, username }),
    });
    if (response.ok) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
  }
  return false;
}

export async function getQuestionFetch(
  id: string,
  username: string
): Promise<questionResponseType | undefined> {
  try {
    const response: Response = await fetch(`${SERVER_URL}/game/question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, username }),
    });
    if (response.ok) {
      const data: questionResponseType = await response.json();
      console.log("Data:", data);
      return data;
    }
  } catch (err) {
    console.log(err);
  }
  return undefined;
}
