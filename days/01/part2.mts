import assert from "assert";
import dedent from "dedent";
import { readDay } from "../../utils/read.mjs";

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b);
}

const digits = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
] as const;
type Digit = (typeof digits)[number];

function asNumber(value: Digit): number {
  switch (value) {
    case "one":
      return 1;
    case "two":
      return 2;
    case "three":
      return 3;
    case "four":
      return 4;
    case "five":
      return 5;
    case "six":
      return 6;
    case "seven":
      return 7;
    case "eight":
      return 8;
    case "nine":
      return 9;
    default:
      return parseInt(value);
  }
}

function scoreLine(line: string): number {
  let minIndex = Number.MAX_SAFE_INTEGER;
  let maxIndex = Number.MIN_SAFE_INTEGER;
  let minDigit: Digit | undefined;
  let maxDigit: Digit | undefined;

  for (let digit of digits) {
    const first = line.indexOf(digit);
    const last = line.lastIndexOf(digit);
    if (first === -1 || last === -1) continue;

    if (first < minIndex) {
      minDigit = digit;
      minIndex = first;
    }

    if (last > maxIndex) {
      maxDigit = digit;
      maxIndex = last;
    }
  }

  if (minDigit == null || maxDigit == null) {
    throw new Error(
      `Line "${line}" had no digits. That's not supposed to happen.`
    );
  }

  const score = parseInt(`${asNumber(minDigit)}${asNumber(maxDigit)}`);

  console.log(`"${score}" = "${minDigit}" + "${maxDigit}" -- (${line})`);
  return score;
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
  two1nine
  eightwothree
  abcone2threexyz
  xtwone3four
  4nineeightseven2
  zoneight234
  7pqrstsixteen
`);

assert(sample === 281, "Sample result must match.");
assert(
  scoreLine("2ninehnsnnvj21fkeightwodmz") == 22,
  "last digit should be two, not eight"
);
console.log("---");
console.log(scoreDoc(await readDay(1)));
