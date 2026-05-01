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
        }
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
        }
        // Levels 5-24 follow the same pattern...
    }
};