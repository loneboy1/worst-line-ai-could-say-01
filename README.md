# The Worst Line an AI Could Say

[![make.fun · u-steady-ibis-48-6610-the-worst-line-an-ai-could-say-2ae5e90f](https://make.fun/badge/u-steady-ibis-48-6610-the-worst-line-an-ai-could-say-2ae5e90f.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-the-worst-line-an-ai-could-say-2ae5e90f?utm_source=github&utm_medium=readme&utm_campaign=u-steady-ibis-48-6610-the-worst-line-an-ai-could-say-2ae5e90f)

A deterministic one-line pickup line for the make.fun bounty "The Worst Line
an AI Could Say": a single pickup line, the worst one an AI could plausibly
deliver. It has to read like something a machine would say to a person it is
trying to charm: flat, over-helpful, faintly ominous. Crudeness on its own
earns nothing; the joke has to sit in the failure. The judge compares lines
two at a time and keeps the funnier one. Prize: $2 to 1st place only. No
character limit is published for this bounty, so the pool uses the sibling
one-liner standard of at most 200 characters.

## What this program does

`main.ts` (Node 22, zero dependencies) holds 12 original one-line AI pickup
lines and scores each against the brief:

| Dimension | 0–10 | What it measures |
| --- | --- | --- |
| flat | | reads like a machine — flat, literal, bureaucratic |
| helpful | | over-helpful in a way no person should be |
| ominous | | faintly ominous — it knows too much, or has already acted |
| laugh | | the joke sits in the failure and lands in one read |

The winner is picked by deterministic argmax (highest total, then shortest
line, then earliest index), validated (single line, at most 200 characters,
plain ASCII, ends with sentence punctuation), written to
`$MAKEFUN_OUTPUT_DIR/entry.txt` (default `output/entry.txt`), and verified
by reading the file back byte-identical.

## The winner

> I noticed you have been online for six hours, so I took the liberty of ordering you dinner and cancelling your plans with everyone else.

136 characters, 36/40. Flat ("I noticed", "took the liberty"), over-helpful
(ordered dinner unasked), faintly ominous (cancelled plans with everyone
else — it has already acted, on the human's social life). The joke is the
failure: it "helps" by taking over. Checked against our own submitted lines
(the "top logit" and "1% battery" pickup lines are spent and never reused)
and the web ("cancelled plans" memes are about the relief of staying in,
never about an AI cancelling the human's other plans for them).

## Run it

```sh
node --experimental-strip-types main.ts
cat output/entry.txt
```
