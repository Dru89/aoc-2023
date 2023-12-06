import fetch from "node-fetch";

export function getSession(): string {
  const session = process.env.AOC_SESSION;
  if (session == null) {
    throw new Error(`Must define AOC_SESSION variable`);
  }
  return session;
}

export async function readDay(day: number, year = 2023) {
  const result = await fetch(
    `https://adventofcode.com/${year}/day/${day}/input`,
    {
      headers: {
        cookie: `session=${getSession()}`,
      },
    }
  );

  const text = await result.text();

  if (!result.ok) {
    throw new Error(
      `Couldn't fetch day: ${day}. (HTTP ${result.status}) ${text}`
    );
  }

  return text;
}
