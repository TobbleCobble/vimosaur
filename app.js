import { VimosaurMotion } from './vimosaur-motion.js';

const config = {
    challengesPerLevel: 10,
    jsCode: `// Level 1: The Hunt\nfunction rawr() {\n  const dino = "Vimosaur";\n  console.log(dino + " is learning!");\n  return true;\n}`
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
    isInfinite: false
};

const motion = new VimosaurMotion(config.jsCode);

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

function render() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    const lines = config.jsCode.split('\n');
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
}

// Target Logic
function generateNewTarget() {
    const lines = config.jsCode.split('\n');
    const y = Math.floor(Math.random() * lines.length);
    const line = lines[y];
    const x = line.length > 0 ? Math.floor(Math.random() * line.length) : 0;
    const current = motion.getPos();
    if (x === current.x && y === current.y) return generateNewTarget();
    gameState.activeTarget = { x, y };
}

// Input Listener
window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('level-modal');
    if (modal && !modal.classList.contains('hidden')) return;

    const validKeys = ['h', 'j', 'k', 'l'];
    if (!validKeys.includes(e.key)) return;

    motion.move(e.key);
    internalStats.recordMove();

    const currentPos = motion.getPos();
    if (currentPos.x === gameState.activeTarget.x && currentPos.y === gameState.activeTarget.y) {
        handleTargetReached();
    }
    
    render();
});

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
            gameState.level++;
            gameState.challengesCompleted = 0;
            gameState.isInfinite = false;
            
            generateNewTarget();
            
            console.log(`Vimosaur evolved to Level ${gameState.level}`);
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

// INITIAL TRIGGER
render();