import assert from "assert";
import dedent from "dedent";
import { readDay } from "../../utils/read.mjs";

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b);
}

function scoreLine(line: string): number {
  const result = line.match(/\d/g);
  if (result == null || result.length === 0) {
    throw new Error(
      `Line "${line}" had no digits. That's not supposed to happen.`
    );
  }

  return parseInt(`${result.at(0)}${result.at(-1)}`);
}

function scoreDoc(doc: string): number {
  return sum(
    doc
      .split("\n")
      .filter((line) => line)
      .map((line) => scoreLine(line))
  );
}

const sample = scoreDoc(dedent`
  1abc2
  pqr3stu8vwx
  a1b2c3d4e5f
  treb7uchet
`);

assert(sample === 142, "Sample result must match.");
console.log(scoreDoc(await readDay(1)));
