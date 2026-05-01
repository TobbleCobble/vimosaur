import { VimosaurMotion } from './vimosaur-motion.js';

const config = {
    challengesPerLevel: 10,
    levels: [
        "", // Level 0 (unused)
        `// Level 1: The Hunt\nfunction rawr() {\n  const dino = "Vimosaur";\n  console.log(dino + " is learning!");\n  return true;\n}`,
        `// Level 2: The Migration\nfunction evolveDino(species, DNA) {\n  let mutation = DNA.split("").reverse().join("");\n  if (species === "Vimosaur") {\n    return \`Species: \${species} | DNA: \${mutation}\`;\n  }\n  console.warn("Unknown prehistoric entity detected!");\n  return null;\n}`,
        `// Level 3: The Apex\nclass Vimosaur extends Predator {\n  constructor(name) {\n    super(name);\n    this.stamina = 100;\n  }\n  hunt(target) {\n    return this.stamina > 0 ? "Success" : "Exhausted";\n  }\n}`
    ]
};

// Internal Stats Logic to prevent "undefined" errors
const internalStats = {
    totalMoves: 0,
    startTime: performance.now(),
    recordMove() { this.totalMoves++; },
    getFormattedStats() {
        const elapsed = (performance.now() - this.startTime) / 1000;
        return {
            avg: (elapsed / (gameState.challengesCompleted || 1)).toFixed(2),
            total: this.totalMoves
        };
    }
};

let gameState = {
    level: 1,
    challengesCompleted: 0,
    activeTarget: { x: 10, y: 1 },
    isInfinite: false,
    validKeys: ['h', 'j', 'k', 'l']
};

const motion = new VimosaurMotion(config.levels[gameState.level]);

const levelMetadata = {
    1: { title: "The Grit", desc: "Basic hjkl movement. Muscle memory starts here." },
    2: { title: "The Sprint", desc: "Word jumps (w, e, b). Navigate symbols and code blocks." },
    3: { title: "The Snipe", desc: "Search find (f, t). Snipe characters across lines." },
    4: { title: "The Vertical", desc: "Paragraph jumps ({, }). Master vertical space." }
};

function updateNavbar() {
    const nav = document.getElementById('nav-level-list');
    nav.innerHTML = config.levels.map((_, i) => {
        if (i === 0) return '';
        const isActive = gameState.level === i;
        const meta = levelMetadata[i] || { title: `Level ${i}`, desc: "More motions..." };
        
        return `
            <button onclick="window.jumpToLevel(${i})" 
                class="text-left p-3 border transition-all duration-200 group ${
                    isActive 
                    ? 'border-[#FFDBC2] bg-[#FFDBC2]/5' 
                    : 'border-transparent hover:border-[#FFDBC2]/30'
                }">
                <div class="text-[10px] uppercase font-black mb-1 ${isActive ? 'text-[#FFDBC2]' : 'opacity-40'}">
                    Level ${i}: ${meta.title}
                </div>
                <div class="text-[9px] leading-relaxed opacity-60 group-hover:opacity-100">
                    ${meta.desc}
                </div>
            </button>
        `;
    }).join('');
}

function getCharClass(line, char, x) {
    if (line.trim().startsWith('//')) return 'token-comment';
    const keywords = ['function', 'const', 'return', 'let', 'var'];
    const words = line.split(/\W+/);
    const isKeyword = keywords.some(kw => {
        const start = line.indexOf(kw);
        return x >= start && x < start + kw.length;
    });
    if (isKeyword) return 'token-keyword';
    if (line.includes('"') || line.includes("'")) return 'token-string';
    return 'token-default';
}

function levelUp() {
    gameState.level++;
    gameState.challengesCompleted = 0;
    const nextCode = config.levels[gameState.level] || config.levels[1];
    motion.updateContent(nextCode);
    
    if (gameState.level === 2) {
        gameState.validKeys = ['h', 'j', 'k', 'l', 'w', 'e', 'b'];
        document.getElementById('instruction-box').innerText = 
            "Level 2 Unlocked: Use 'w' (word start), 'e' (word end), and 'b' (back) to move faster!";
    }
    if (gameState.level === 3) {
        gameState.validKeys = ['h', 'j', 'k', 'l', 'w', 'e', 'b', 'f', 't'];
        document.getElementById('instruction-box').innerText = 
            "Level 3: Search with 'f' (find) or 't' (until). Press 'f' then any character to jump to it!";
    }
    
    generateNewTarget();
    render();
}

function render() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    const currentCode = config.levels[gameState.level] || config.levels[1];
    const lines = currentCode.split('\n');
    const currentPos = motion.getPos();
    let html = '';

    lines.forEach((line, y) => {
        const chars = line.split('');
        
        if (chars.length === 0) {
            const isCursor = (currentPos.y === y && currentPos.x === 0);
            const isTarget = (gameState.activeTarget.y === y && gameState.activeTarget.x === 0);
            html += `<span class="${isCursor ? 'cursor' : isTarget ? 'target-box' : ''}"> </span>\n`;
            return;
        }

        chars.forEach((char, x) => {
            const isCursor = (x === currentPos.x && y === currentPos.y);
            const isTarget = (x === gameState.activeTarget.x && y === gameState.activeTarget.y);
            
            let charContent = char;
            let specialClass = "";
            
            if (isCursor) specialClass = "cursor";
            else if (isTarget) specialClass = "target-box";

            const tokenClass = getCharClass(line, char, x);
            html += `<span class="${tokenClass} ${specialClass}">${charContent}</span>`;
        });
        html += '\n';
    });

    editor.innerHTML = html;
    
    const infiniteUI = document.getElementById('infinite-controls');
    if (infiniteUI) {
        if (gameState.isInfinite) {
            infiniteUI.classList.remove('hidden');
        } else {
            infiniteUI.classList.add('hidden');
        }
    }

    const statResults = internalStats.getFormattedStats();
    document.getElementById('pos-text').innerText = `${currentPos.y + 1},${currentPos.x + 1}`;
    document.getElementById('stat-progress').innerText = `${gameState.challengesCompleted}/10`;
    document.getElementById('stat-total').innerText = statResults.total;
    document.getElementById('stat-avg').innerText = `${statResults.avg}s`;

    const keysDisplay = document.getElementById('unlocked-keys');
    keysDisplay.innerHTML = gameState.validKeys
        .map(k => `<span class="border border-[#FFDBC2]/40 px-2 py-0.5 text-[9px] font-bold">${k}</span>`)
        .join('');

    // Update level status
    document.getElementById('status-bar').innerText = `Status: Level ${gameState.level} Hunting...`;
}

// Target Logic
async function generateNewTarget() {
    const currentCode = config.levels[gameState.level] || config.levels[1];
    const lines = currentCode.split('\n');
    const currentPos = motion.getPos();

    let target = null;
    let attempts = 0;

    try {
        // Dynamically import the target generator for the current level
        const module = await import(`./targets/level${gameState.level}.js`);
        while (!target && attempts < 30) {
            const y = Math.floor(Math.random() * lines.length);
            const line = lines[y];
            
            if (line && line.trim().length > 0) {
                // Pass Math.random into the generator
                target = module.generate(line, y, currentPos, Math.random());
            }
            attempts++;
        }

        if (target) {
            gameState.activeTarget = target;
            render();
        }
    } catch (err) {
        console.error("Failed to load level generator, falling back to Level 1", err);
        // Fallback logic if a file is missing
        const fallback = await import(`./targets/level1.js`);
        gameState.activeTarget = fallback.generate(line, y, currentPos);
    }
}

// Input Listener
window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('level-modal');
    const isModalOpen = !modal.classList.contains('hidden');

    // --- 1. Modal Keyboard Controls ---
    if (isModalOpen) {
        const key = e.key.toLowerCase();
        if (key === 'n') window.gameAction('next');
        if (key === 'i') window.gameAction('infinite');
        if (key === 'r') window.gameAction('restart');
        return; // Block movement keys while modal is open
    }

    // 2. Handle Search State (f/t)
    if (motion.pendingAction) {
        // Ignore "dead" keys like Shift/Control/Alt themselves
        if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt') return;
        if (e.key === 'Escape') { motion.pendingAction = null; render(); }
        // Use e.key (this will be "(" if you press Shift+9)
        motion.findChar(e.key);
        
        // RE-RENDER IMMEDIATELY to clear the "-- SEARCH --" text
        updateModeDisplay(); 
        checkTargetReached();
        render();
        return; 
    }

    if (!gameState.validKeys.includes(e.key)) return;
    internalStats.recordMove();

    motion.move(e.key);
    
    updateModeDisplay();

    if (!motion.pendingAction) {
        checkTargetReached();
    }
    
    render();
});

function updateModeDisplay() {
    const modeEl = document.getElementById('mode-text');
    if (motion.pendingAction) {
        modeEl.innerText = `-- SEARCH (${motion.pendingAction.toUpperCase()}) --`;
        modeEl.style.color = "#ff4d00"; // Lava color to show active state
    } else {
        modeEl.innerText = "-- NORMAL --";
        modeEl.style.color = ""; // Reset to default peach
    }
}

function checkTargetReached() {
    const currentPos = motion.getPos();
    if (currentPos.x === gameState.activeTarget.x && currentPos.y === gameState.activeTarget.y) {
        handleTargetReached();
    }
}

function handleTargetReached() {
    gameState.challengesCompleted++;
    if (gameState.challengesCompleted >= config.challengesPerLevel && !gameState.isInfinite) {
        document.getElementById('level-modal').classList.remove('hidden');
        document.getElementById('editor-container').classList.add('modal-active');
    } else {
        generateNewTarget();
    }
}

function jumpToLevel(levelNum) {
    if (levelNum >= config.levels.length) return;
    
    gameState.level = levelNum;
    gameState.challengesCompleted = 0;
    gameState.isInfinite = false;

    // Logic to set keys based on level
    if (levelNum === 1) unlockedKeys = ['h', 'j', 'k', 'l'];
    if (levelNum === 2) unlockedKeys = ['h', 'j', 'k', 'l', 'w', 'e', 'b'];
    if (levelNum === 3) unlockedKeys = ['h', 'j', 'k', 'l', 'w', 'e', 'b', 'f', 't'];

    motion.updateContent(config.levels[levelNum]);
    motion.cursor = { x: 0, y: 0 };
    motion.preferredX = 0;
    
    generateNewTarget();
    updateNavbar();
    render();
}

window.addEventListener('vimosaur-action', (e) => {
    const modal = document.getElementById('level-modal');
    const editorContainer = document.getElementById('editor-container');
    
    modal.classList.add('hidden');
    editorContainer.classList.remove('modal-active');

    switch(e.detail) {
        case 'next':
            gameState.isInfinite = false;
            generateNewTarget();
            console.log(`Vimosaur evolved to Level ${gameState.level}`);
            levelUp();
            break;
            
        case 'infinite':
            gameState.isInfinite = true;
            generateNewTarget();
            break;
            
        case 'restart':
            location.reload();
            break;
    }
    render();
});

window.jumpToLevel = (levelNum) => {
    if (levelNum >= config.levels.length) return;
    
    gameState.level = levelNum;
    gameState.challengesCompleted = 0;
    gameState.isInfinite = false;

    // Logic to set keys based on level
    if (levelNum === 1) gameState.validKeys = ['h', 'j', 'k', 'l'];
    if (levelNum === 2) gameState.validKeys = ['h', 'j', 'k', 'l', 'w', 'e', 'b'];
    if (levelNum === 3) gameState.validKeys = ['h', 'j', 'k', 'l', 'w', 'e', 'b', 'f', 't'];

    motion.updateContent(config.levels[levelNum]);
    motion.cursor = { x: 0, y: 0 };
    motion.preferredX = 0;
    
    generateNewTarget();
    updateNavbar();
    render();
};

// INITIAL TRIGGER
updateNavbar();
render();
