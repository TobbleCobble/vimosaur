# Vimosaur

an open source, web based tool for learning vim

## Level Workflow

1. Basic Displacement (The Foundation)

Focuses on moving the cursor without changing the text. These are the "reflex" motions.

    Level 1: Home Row Grit (h, j, k, l) — Character-by-character navigation.

    Level 2: The Sprint (w, e, b) — Moving by word and symbol boundaries.

    Level 3: Edge Cases (0, $, ^) — Jumping to the absolute start, absolute end, and first non-blank character of a line.

    Level 4: The Vertical (G, gg, N%) — Jumping to the end of the file, start of the file, or specific line percentages.

2. Precise Navigation (The Sniper)

Focuses on jumping to specific characters or blocks.

    Level 5: Horizontal Snipe (f, t, F, T) — Finding and landing on specific characters within a single line.

    Level 6: Scope Search (/, ?, n, N) — Searching for patterns globally and cycling through matches.

    Level 7: The Structuralist ({, }, (, )) — Jumping between empty lines (paragraphs) and sentence structures.

    Level 8: The Connector (%) — Jumping between matching brackets, parentheses, and braces.

3. Inserting & Appending (The Gateway)

The transition from "Normal Mode" to "Insert Mode" in different contexts.

    Level 9: Basic Entry (i, a) — Inserting before the cursor and appending after it.

    Level 10: Line Entry (I, A) — Inserting at the very start of a line and appending at the very end.

    Level 11: Opening Voids (o, O) — Creating a new line below or above the current line and entering insert mode.

4. Direct Editing (The Scalpel)

Basic deletions and changes that don't require complex modifiers yet.

    Level 12: Character Erasure (x, X) — Deleting characters under and before the cursor.

    Level 13: The Joiner (J) — Joining two lines together into one.

    Level 14: Case Toggling (~) — Switching character case (upper to lower and vice versa).

5. Modifiers & Verbs (The Language of Vim)

This is where Vimosaur becomes an engineering tool. These levels teach how to combine a Verb (d, c, y) with a Motion (w, f, {).

    Level 15: The Delete Verb (dw, d$, df;) — Deleting until specific boundaries.

    Level 16: The Change Verb (cw, ct)) — Deleting and immediately entering Insert mode.

    Level 17: The Yank & Put (yy, p, P) — Copying and pasting lines or words.

    Level 18: Line Operations (dd, cc) — Doubling a verb to apply it to the entire current line.

6. Text Objects (The Surgeon)

The most powerful concept: acting on "objects" regardless of where the cursor is inside them.

    Level 19: Inner Objects (ci", di(, yi{) — Changing or deleting everything inside quotes or brackets.

    Level 20: Around Objects (ca", da(, da{) — Changing or deleting the objects including their delimiters.

    Level 21: Word Objects (ciw, daw) — Targeting the current word regardless of cursor position.

7. Advanced Automation

   Level 22: The Repeater (.) — Repeating the last editing command.

   Level 23: The Counter (3w, 5j, 2df;) — Prefixing motions with numbers to multiply their effect.

   Level 24: Visual Blocks (v, V, <Ctrl-v>) — Selecting and manipulating text blocks visually.

### TODO:

- implement daily game - puzzle game where you only have certain keys and have to make changes on par
  - migrate to flask or django to add in users
  - or just save to cookies to save scores
