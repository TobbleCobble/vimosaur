import { VimosaurMotion } from './vimosaur-motion.js';
import { config } from './config.js';


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
    validKeys: ['h', 'j', 'k', 'l'],
    countBuffer: ""
};

const motion = new VimosaurMotion(config.levels[1].code);

const levelMetadata = {
    1: { title: "The Grit", desc: "Basic hjkl movement. Muscle memory starts here." },
    2: { title: "The Sprint", desc: "Word jumps (w, e, b). Navigate symbols and code blocks." },
    3: { title: "The Snipe", desc: "Search find (f, t). Snipe characters across lines." },
    4: { title: "The Vertical", desc: "Paragraph jumps ({, }). Master vertical space." }
};

// app.js

async function updateNavbar() {
    const nav = document.getElementById('nav-level-list');
    if (!nav) return;

    let navHtml = '';

    for (const cat of config.categories) {
        navHtml += `
            <div class="mb-4">
                <h3 class="text-[12px] uppercase tracking-[0.2em] opacity-30 mb-2 ml-2">${cat.name}</h3>
                <div class="flex flex-col gap-1">`;

        for (const id of cat.levelIds) {
            const level = config.levels[id];
            
            // Check if the level is actually implemented via our file check
            const isImplemented = implementedLevels.has(id);
            const isActive = gameState.level === id;

            navHtml += `
                <button 
                    ${isImplemented ? `onclick="window.jumpToLevel(${id})"` : 'disabled'}
                    class="group text-left px-3 py-2 border transition-all duration-300 ${
                        !isImplemented 
                        ? 'opacity-20 cursor-not-allowed bg-black/20 border-transparent' 
                        : isActive 
                            ? 'border-[#FFDBC2] bg-[#FFDBC2]/5' 
                            : 'border-transparent hover:bg-white/5'
                    }">
                    <div class="text-[10px] ${isActive ? 'text-[#FFDBC2] font-bold' : 'opacity-40 group-hover:opacity-100'}">
                        ${id}. ${level ? level.title : 'Coming Soon'}
                    </div>
                    ${!isImplemented ? '<div class="text-[7px] uppercase tracking-tighter opacity-40 mt-1">File Missing</div>' : ''}
                </button>`;
        }
        navHtml += `</div></div>`;
    }

    nav.innerHTML = navHtml;
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
    const nextCode = config.levels[gameState.level].code || config.levels[1].code;
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
    if (gameState.level === 4) {
        gameState.validKeys = ['h', 'j', 'k', 'l', 'w', 'e', 'b', 'f', 't', '{', '}'];
        document.getElementById('instruction-box').innerText = 
            "Level 3: Search with 'f' (find) or 't' (until). Press 'f' then any character to jump to it!";
    }
    
    generateNewTarget();
    render();
}

function render() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    const currentCode = config.levels[gameState.level].code || config.levels[1].code;
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
    const currentCode = config.levels[gameState.level].code || config.levels[1].code;
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

    if (isModalOpen) {
        const key = e.key.toLowerCase();
        if (key === 'n') window.gameAction('next');
        if (key === 'i') window.gameAction('infinite');
        if (key === 'r') window.gameAction('restart');
        return; // Block movement keys while modal is open
    }

    if (motion.searchingAction) {
        if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt') return;
        if (e.key === 'Escape') { motion.searchingAction = null; render(); }
        motion.findChar(e.key);
        
        updateModeDisplay(); 
        checkTargetReached();
        render();
        return; 
    }

    // if (/[0-9]/.test(e.key)) {
    //     // Vim '0' is a motion, but 1-9 starts a count
    //     if (e.key === '0' && gameState.countBuffer === "") {
    //         // Treat as '0' motion (start of line)
    //         motion.move('0');
    //     } else {
    //         gameState.countBuffer += e.key;
    //         updateStatusBar(`Count: ${countBuffer}`);
    //         return; 
    //     }
    // }

    // if (e.key === '%') {
    //     if (countBuffer !== "") {
    //         const percent = parseInt(countBuffer);
    //         motion.jumpToPercentage(percent);
    //         gameState.countBuffer = ""; // Reset
    //         render();
    //         return;
    //     }
    // }

    if (!gameState.validKeys.includes(e.key)) return;
    internalStats.recordMove();

    motion.move(e.key);
    
    updateModeDisplay();

    if (!motion.searchingAction) {
        checkTargetReached();
    }
    
    render();
});

function updateModeDisplay() {
    const modeEl = document.getElementById('mode-text');
    if (motion.searchingAction) {
        modeEl.innerText = `-- SEARCH (${motion.searchingAction.toUpperCase()}) --`;
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
    const levelData = config.levels[levelNum];
    if (!levelData) return;
    
    gameState.level = levelNum;
    gameState.challengesCompleted = 0;
    gameState.isInfinite = false;

    gameState.validKeys = levelData.keys;
    
    motion.updateContent(config.levels[levelNum].code);
    motion.cursor = { x: 0, y: 0 };
    motion.preferredX = 0;

    document.getElementById('instruction-box').innerText = `${levelData.title}: ${levelData.desc}`;
    
    generateNewTarget();
    updateNavbar();
    render();
};

// Store which levels actually have valid generator scripts
let implementedLevels = new Set();

async function validateLevels() {
    for (const id in config.levels) {
        try {
            // Attempt to fetch the script head to see if it exists
            const response = await fetch(`./targets/level${id}.js`, { method: 'HEAD' });
            if (response.ok) {
                implementedLevels.add(parseInt(id));
            }
        } catch (e) {
            console.log(`Level ${id} generator not found.`);
        }
    }
    updateNavbar(); // Refresh navbar once we know what's real
}

validateLevels();
render();
