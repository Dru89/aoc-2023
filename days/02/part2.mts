import assert from "assert";
import dedent from "dedent";
import { readDay } from "../../utils/read.mjs";

type Color = "red" | "green" | "blue";
interface Game {
  id: number;
  reveals: Array<Record<Color, number>>;
}

function power(game: Game): number {
  let maxRed = 0;
  let maxGreen = 0;
  let maxBlue = 0;

  for (let { red, green, blue } of game.reveals) {
    maxRed = Math.max(red ?? 0, maxRed);
    maxGreen = Math.max(green ?? 0, maxGreen);
    maxBlue = Math.max(blue ?? 0, maxBlue);
  }

  console.log(`Game ${game.id}: R=${maxRed}, G=${maxGreen}, B=${maxBlue}`);
  return maxRed * maxGreen * maxBlue;
}

function parseId(gameString: string): number {
  const matchId = gameString.match(/Game (\d+)/);
  if (matchId == null || matchId[1] == null) {
    throw new Error(`Expected "${gameString}" to look like "Game ##"`);
  }

  return parseInt(matchId[1]);
}

function parseReveal(revealString: string): Record<Color, number> {
  return revealString
    .trim()
    .split(",")
    .map((colorSet) => colorSet.trim().split(" "))
    .reduce(
      (record, set) => ({
        ...record,
        [set[1] as Color]: (record[set[1] as Color] ?? 0) + parseInt(set[0]),
      }),
      {} as Record<Color, number>
    );
}

function parseLine(line: string): Game {
  const [gameId, value] = line.split(":");
  const id = parseId(gameId);
  const reveals = value.split(";").map((reveal) => parseReveal(reveal));
  return { id, reveals };
}

function scoreDoc(doc: string): number {
  return doc
    .split("\n")
    .filter((line) => line)
    .map((line) => parseLine(line))
    .map((game) => power(game))
    .reduce((a, b) => a + b);
}

const score = scoreDoc(dedent`
  Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
  Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
  Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
  Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`);

assert(score === 2286, "Expected test input to match.");
console.log(scoreDoc(await readDay(2)));
