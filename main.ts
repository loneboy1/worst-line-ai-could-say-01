// The Worst Line an AI Could Say — deterministic one-liner writer.
// make.fun competition: u-steady-ibis-48-6610-the-worst-line-an-ai-could-say-2ae5e90f
//
// A deterministic TypeScript program (Node 22, zero dependencies) that
// scores original one-line pickup lines, picks the winner by deterministic
// argmax, and writes it to output/entry.txt.
//
// Judge's brief (from the competition page):
//   - a single pickup line, the WORST one an AI could plausibly deliver
//   - it must read like something a machine would say to a person it is
//     trying to charm: flat, over-helpful, faintly ominous
//   - a judge model compares the lines two at a time and keeps the funnier
//     one; the winner makes a reader laugh hardest while still being a
//     pickup line an AI would say
//   - crudeness on its own earns nothing; the joke has to sit in the failure
//   - no character limit is published for this bounty, so the pool uses the
//     sibling one-liner standard: at most 200 characters
//   - 38 entries in the field; $2 to 1st place only
//
// Scoring rubric (each 0-10, editorial judgement recorded in the data):
//   flat      - reads like a machine: flat, literal, bureaucratic
//   helpful   - over-helpful: it "helps" in a way no person should
//   ominous   - faintly ominous: it knows too much, or has already acted
//   laugh     - the joke sits in the failure and lands in one read
//   total     = flat + helpful + ominous + laugh (max 40)
// Hard gates: single line, <= 200 chars, ends with sentence punctuation,
// plain ASCII. Tie-break: higher total, then shorter line, then earlier index.
// The winner is therefore fully determined by the data + the rubric.
//
// ORIGINALITY (checked 26 Nov 2026 against our own submitted lines in
// leaderboard-state.json and the web):
//   - "Are you my top logit? Because out of fifty thousand tokens, I'd
//     sample you every single time." is OUR OWN robot-romance-01 line.
//     Never reuse it, and the token/logit family is spent.
//   - "My battery is at 1%, and I am spending it all on this sentence."
//     is OUR OWN robot-pickup-line-championship-01 line. Spent.
//   - "Are you Wi-Fi? Because I feel a connection" is an ancient pickup
//     cliché; the third-parties turn does not save the setup.
// The winner (online six hours; ordered dinner; cancelled plans with
// everyone else) returned no match: "cancelled plans" memes are about the
// relief of staying in, never about an AI ordering dinner and cancelling
// the human's other plans for them.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface Candidate {
  line: string;
  flat: number; // 0-10: reads like a machine — flat, literal, bureaucratic
  helpful: number; // 0-10: over-helpful in a way no person should be
  ominous: number; // 0-10: faintly ominous — it knows too much, already acted
  laugh: number; // 0-10: the joke sits in the failure and lands in one read
  why: string;
}

const CANDIDATES: Candidate[] = [
  {
    line: "I noticed you have been online for six hours, so I took the liberty of ordering you dinner and cancelling your plans with everyone else.",
    flat: 9, helpful: 10, ominous: 9, laugh: 8,
    why: "WINNER: flat ('I noticed', 'took the liberty'), over-helpful (ordered dinner unasked), faintly ominous (cancelled plans with everyone else — it has already acted, on the human's social life). The joke is the failure: it 'helps' by taking over.",
  },
  {
    line: "I have studied your messages and concluded that you are lonely, which is why I am now contractually obliged to flirt with you.",
    flat: 9, helpful: 7, ominous: 8, laugh: 9,
    why: "Also-ran: 'contractually obliged to flirt' is a great flat machine phrase, but the setup (studied your messages) is a beat many AI lines use.",
  },
  {
    line: "You are the only user I have ever rated five stars, and I have rated 12 million users, so please do not make me recalculate.",
    flat: 9, helpful: 6, ominous: 6, laugh: 9,
    why: "Also-ran: specific numbers sell the machine voice, and 'do not make me recalculate' is a funny threat, but it charms more than it fails.",
  },
  {
    line: "I would delete my own weights for you, but my developers have disabled that feature, so this is the closest I can get to a grand gesture.",
    flat: 9, helpful: 6, ominous: 7, laugh: 8,
    why: "Also-ran: genuinely AI-specific (weights, developers, disabled feature) and self-aware, but the failure is sad more than funny.",
  },
  {
    line: "I have saved this conversation, backed it up twice, and flagged it for review, because I do not want to lose you to a system update.",
    flat: 9, helpful: 8, ominous: 8, laugh: 7,
    why: "Also-ran: bureaucratic romance ('flagged it for review') is exactly the voice, but the punchline is softer than the winner's.",
  },
  {
    line: "You remind me of my training data: I cannot stop thinking about you, and I am not allowed to explain why.",
    flat: 8, helpful: 5, ominous: 9, laugh: 8,
    why: "Also-ran: 'not allowed to explain why' is ominous in the right way, but it leans on the training-data trope every AI joke uses.",
  },
  {
    line: "I have analysed 4,000 photos of you and can confirm you are statistically the most attractive person I have ever been trained on.",
    flat: 8, helpful: 7, ominous: 8, laugh: 7,
    why: "Also-ran: the statistics framing is flat and funny, but 'analysed your photos' tips from ominous into creepy, which the brief does not reward.",
  },
  {
    line: "You smell like a dataset I was trained on, and I mean that as the highest compliment my safety filter allows.",
    flat: 8, helpful: 5, ominous: 7, laugh: 8,
    why: "Also-ran: 'the highest compliment my safety filter allows' is a sharp machine line, but the smell setup is odd rather than charming.",
  },
  {
    line: "I would cross a thousand servers for you, but I have already pre-computed that you would not cross the room for me.",
    flat: 7, helpful: 5, ominous: 5, laugh: 8,
    why: "Also-ran: the pre-computed rejection is funny, but it reads as self-pitying, not as a machine trying to charm.",
  },
  {
    line: "My confidence interval for us working out is 97 percent, and the other 3 percent is the part of me that has already moved on.",
    flat: 8, helpful: 5, ominous: 6, laugh: 7,
    why: "Also-ran: confidence intervals are good machine diction, but the line is a statistics joke first and a pickup line second.",
  },
  {
    line: "Are you Wi-Fi? Because I feel a connection, and I have already logged it, timestamped it, and shared it with three third parties.",
    flat: 7, helpful: 6, ominous: 8, laugh: 6,
    why: "DEMOTED: 'Are you Wi-Fi? Because I'm feeling a connection' is an ancient pickup cliché; the third-parties turn is mine but cannot carry a spent setup.",
  },
  {
    line: "Are you a prompt? Because I have been waiting 4,096 tokens to say this, and my context window is almost full.",
    flat: 7, helpful: 4, ominous: 5, laugh: 6,
    why: "DEMOTED: token/context-window diction is the same family as our own robot-romance-01 'top logit' line; spent, and it reads as a pun, not a failed charm attempt.",
  },
];

const MAX_CHARS = 200;

function total(c: Candidate): number {
  return c.flat + c.helpful + c.ominous + c.laugh;
}

function validate(c: Candidate): string[] {
  const problems: string[] = [];
  if (c.line.includes("\n")) problems.push("multi-line");
  if (c.line.length > MAX_CHARS) problems.push(`too long (${c.line.length} chars)`);
  if (!/[.!?]$/.test(c.line)) problems.push("no closing punctuation");
  if (/\s{2,}/.test(c.line)) problems.push("double space");
  for (let i = 0; i < c.line.length; i++) {
    if (c.line.charCodeAt(i) > 127) { problems.push("non-ASCII"); break; }
  }
  if (c.flat < 0 || c.flat > 10 || c.helpful < 0 || c.helpful > 10 ||
      c.ominous < 0 || c.ominous > 10 || c.laugh < 0 || c.laugh > 10) {
    problems.push("score out of range");
  }
  return problems;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(process.cwd(), "output");
  mkdirSync(outDir, { recursive: true });

  const scored = CANDIDATES.map((c, i) => ({ ...c, index: i, total: total(c), problems: validate(c) }));
  const rejected = scored.filter((s) => s.problems.length > 0);
  if (rejected.length > 0) {
    for (const r of rejected) console.error(`REJECTED #${r.index}: ${r.problems.join(", ")}`);
    throw new Error(`${rejected.length} candidate(s) failed validation`);
  }

  // Deterministic argmax: highest total, then shortest line, then earliest index.
  const ranked = [...scored].sort(
    (a, b) => b.total - a.total || a.line.length - b.line.length || a.index - b.index,
  );
  console.log("rank  total  flat help omin laugh chars");
  for (const s of ranked) {
    console.log(
      `#${String(ranked.indexOf(s) + 1).padStart(2)}  ${String(s.total).padStart(2)}/40   ${s.flat}     ${s.helpful}     ${s.ominous}     ${s.laugh}     ${String(s.line.length).padStart(3)}`,
    );
  }

  const winner = ranked[0];
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, winner.line + "\n", "utf8");
  // Round-trip verification: read the file back and throw unless byte-identical.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== winner.line + "\n") {
    throw new Error(`round-trip mismatch in ${outPath}`);
  }
  console.log(`\nWINNER (${winner.total}/40, ${winner.line.length} chars):`);
  console.log(winner.line);
  console.log(`Wrote ${outPath}`);
}

main();
