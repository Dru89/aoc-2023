import assert from "assert";
import dedent from "dedent";
import { readDay } from "../../utils/read.mjs";

interface Game {
  id: number;
  reveals: Array<Record<string, number>>;
}

function possible(game: Game, rules: Record<string, number>): boolean {
  const colors = Object.keys(rules);
  for (let color of colors) {
    for (let reveal of game.reveals) {
      if ((reveal[color] ?? 0) > rules[color]) {
        return false;
      }
    }
  }
  return true;
}

function parseId(gameString: string): number {
  const matchId = gameString.match(/Game (\d+)/);
  if (matchId == null || matchId[1] == null) {
    throw new Error(`Expected "${gameString}" to look like "Game ##"`);
  }

  return parseInt(matchId[1]);
}

function parseReveal(revealString: string): Record<string, number> {
  return revealString
    .trim()
    .split(",")
    .map((colorSet) => colorSet.trim().split(" "))
    .reduce(
      (record, set) => ({
        ...record,
        [set[1]]: (record[set[1]] ?? 0) + parseInt(set[0]),
      }),
      {} as Record<string, number>
    );
}

function parseLine(line: string): Game {
  const [gameId, value] = line.split(":");
  const id = parseId(gameId);
  const reveals = value.split(";").map((reveal) => parseReveal(reveal));
  return { id, reveals };
}

const rules = { red: 12, green: 13, blue: 14 };
function scoreDoc(doc: string): number {
  return doc
    .split("\n")
    .filter((line) => line)
    .map((line) => parseLine(line))
    .filter((game) => possible(game, rules))
    .map((game) => game.id)
    .reduce((a, b) => a + b);
}

const score = scoreDoc(dedent`
  Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
  Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
  Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
  Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`);

assert(score === 8, "Expected test input to match.");
console.log(scoreDoc(await readDay(2)));
