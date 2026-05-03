export const config = {
    // Structure the curriculum into logical sections
    categories: [
        {
            id: "displacement",
            name: "Basic Displacement",
            levelIds: [1, 2, 3, 4]
        },
        {
            id: "navigation",
            name: "Precise Navigation",
            levelIds: [5, 6, 7, 8]
        },
        { id: "insertion", name: "Inserting Text", levelIds: [9, 10, 11] },
        { id: "editing", name: "The Scalpel (Editing)", levelIds: [12, 13, 14] },
        { id: "language", name: "Verbs & Modifiers", levelIds: [15, 16, 17] }
    ],
    challengesPerLevel: 10,
    // The single source of truth for every level
    levels: {
        1: {
            title: "Home Row Grit",
            desc: "The foundation of Vim. Navigate character by character.",
            keys: ['h', 'j', 'k', 'l'],
            code: `// Level 1: The Hunt\nfunction rawr() {\n  const dino = "Vimosaur";\n  console.log(dino + " is learning!");\n  return true;\n}`
        },
        2: {
            title: "The Sprint",
            desc: "Jump across words and symbols to reach targets faster.",
            keys: ['h', 'j', 'k', 'l', 'w', 'e', 'b'],
            code: `// Level 2: The Migration\nfunction evolveDino(species, DNA) {\n  let mutation = DNA.split("").reverse().join("");\n  return \`Species: \${species}\`;\n}`
        },
        3: {
            title: "Edge Cases",
            desc: "Master the line. 0 (start), $ (end), and ^ (first non-blank).",
            keys: ['h', 'j', 'k', 'l', 'w', 'e', 'b', '0', '$', '^'],
            code: `// Level 3\n    const indent = "This line has spaces";\nconst noIndent = "This one starts at zero";`
        },
        4: {
            title: "The Vertical",
            desc: "Master the file. gg (top), G (bottom), and { } for paragraphs.",
            keys: ['h', 'j', 'k', 'l', 'w', 'e', 'b', '0', '$', '^', '{', '}', 'g', 'G'],
            code: `// Top of File\nfunction first() { return 1; }\n\n\n\nfunction middle() { return 2; }\n\n\n\nfunction last() { return 3; }\n// End of File`
        },
        5: {
            title: "Horizontal Snipe",
            desc: "The Sniper. Use 'f' (find) or 't' (until) followed by a character to jump.",
            keys: ['h', 'j', 'k', 'l', 'w', 'e', 'b', '0', '$', '^', '{', '}', 'g', 'G', 'f', 't','F', 'T'],
            code: `// Level 5\nfunction snipe(target, range) {\n  const result = (target === "Prey") ? "Success" : "Miss";\n  console.log(\`[\${range}m] Result: \${result};\`);\n}`
        },
        6: {
            title: "Scope Search",
            desc: "Global navigation. Use / to search patterns and n/N to cycle.",
            keys: ['h', 'j', 'k', 'l', '/', 'n', 'N'],
            code: `// Level 6\nconst a = "target";\nconst b = "empty";\nconst c = "target";\nconst d = "void";\nconst e = "target";`
        },
        7: {
            title: "The Structuralist",
            desc: "Jump between sentences and paragraphs using ( ) and { }.",
            keys: ['h', 'j', 'k', 'l', '(', ')', '{', '}'],
            code: `// Level 7\nfunction alpha() {\n  return "A";\n}\n\nfunction beta() {\n  return "B";\n}`
        },
        8: {
            title: "The Connector",
            desc: "The % key. Jump between matching brackets and parens.",
            keys: ['h', 'j', 'k', 'l', '%'],
            code: `// Level 8\nif (true) {\n  while (loading) {\n    render([1, 2, 3]);\n  }\n}`
        },
        9: {
            title: "Basic Entry",
            desc: "Enter Insert Mode. 'i' for before, 'a' for after cursor.",
            keys: ['h', 'j', 'k', 'l', 'i', 'a', 'Escape'],
            code: `// Level 9\nconst name = "Vimo";\n// Target: Change name to "Vimosaur"`
        },
        10: {
            title: "Line Entry",
            desc: "Fast insertion. 'I' for line start, 'A' for line end.",
            keys: ['h', 'j', 'k', 'l', 'I', 'A', 'Escape'],
            code: `// Level 10\nconsole.log("Hello")\n// Target: Add a semicolon at the end`
        },
        11: {
            title: "Opening Voids",
            desc: "Create new lines. 'o' for below, 'O' for above.",
            keys: ['h', 'j', 'k', 'l', 'o', 'O', 'Escape'],
            code: `// Level 11\nfunction gap() {\n  const x = 1;\n  const y = 2;\n}`
        },
        12: {
            title: "Character Erasure",
            desc: "Deleting. 'x' deletes under cursor, 'X' deletes before.",
            keys: ['h', 'j', 'k', 'l', 'x', 'X'],
            code: `// Level 12\nconst errror = "Too many rs";`
        },
        13: {
            title: "The Joiner",
            desc: "The 'J' key. Pull the line below up to the current line.",
            keys: ['h', 'j', 'k', 'l', 'J'],
            code: `// Level 13\nconst array = [\n  1, 2, 3\n];`
        },
        14: {
            title: "Case Toggling",
            desc: "The ~ key. Instantly flip UPPER and lower case.",
            keys: ['h', 'j', 'k', 'l', '~'],
            code: `// Level 14\nconst shout = "quiet please";`
        },
        15: {
            title: "The Delete Verb",
            desc: "Combine 'd' with motions (dw, d$, d{).",
            keys: ['h', 'j', 'k', 'l', 'w', 'e', 'b', 'd', '$', '0'],
            code: `// Level 15\nconst junk = "delete this" + "keep this";`
        }
    }
};