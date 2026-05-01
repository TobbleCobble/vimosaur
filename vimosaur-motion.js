// vimosaur-motion.js
export class VimosaurMotion {
    constructor(content) {
        this.lines = content.split('\n');
        this.cursor = { x: 0, y: 1 };
        this.preferredX = 0;
    }

    updateContent(newContent) {
        this.lines = newContent.split('\n');
    }

    // Helper to identify character classes
    getCharClass(char) {
        if (!char) return 'eof';
        if (/\s/.test(char)) return 'space';
        if (/[a-zA-Z0-9_]/.test(char)) return 'word';
        return 'symbol'; // Brackets, dots, operators, etc.
    }

    move(key) {
        const line = this.lines[this.cursor.y];
        const lineLen = line.length;

        switch (key) {
            case 'h':
                if (this.cursor.x > 0) this.cursor.x--;
                this.preferredX = this.cursor.x;
                break;

            case 'l':
                if (this.cursor.x < lineLen - 1) this.cursor.x++;
                this.preferredX = this.cursor.x;
                break;

            case 'k':
                if (this.cursor.y > 0) {
                    this.cursor.y--;
                    this.snapToLine();
                }
                break;

            case 'j':
                if (this.cursor.y < this.lines.length - 1) {
                    this.cursor.y++;
                    this.snapToLine();
                }
                break;
            case 'w': {
                // If we are at the very end of a line, wrap to next line
                if (this.cursor.x >= lineLen - 1) {
                    if (this.cursor.y < this.lines.length - 1) {
                        this.cursor.y++;
                        this.cursor.x = 0;
                        // In Vim, moving to a blank line leaves cursor at 0.
                        // If it's a whitespace indent, we find the first non-space.
                        const nextLine = this.lines[this.cursor.y];
                        const match = nextLine.match(/\S/);
                        if (match) this.cursor.x = match.index;
                    }
                    break;
                }

                // Scan forward to find the start of the next token
                let currentType = this.getCharClass(line[this.cursor.x]);
                let foundNext = false;

                for (let i = this.cursor.x + 1; i < lineLen; i++) {
                    let nextType = this.getCharClass(line[i]);
                    // Transition to a different character type (e.g. word -> symbol, space -> word)
                    if (nextType !== currentType && nextType !== 'space') {
                        this.cursor.x = i;
                        foundNext = true;
                        break;
                    }
                    if (currentType === 'space' && nextType !== 'space') {
                        this.cursor.x = i;
                        foundNext = true;
                        break;
                    }
                    currentType = nextType;
                }

                // If no more tokens on the current line, jump to start of next line
                if (!foundNext) {
                    if (this.cursor.y < this.lines.length - 1) {
                        this.cursor.y++;
                        const nextLine = this.lines[this.cursor.y];
                        const match = nextLine.match(/\S/);
                        this.cursor.x = match ? match.index : 0;
                    } else {
                        // Just go to end of last line
                        this.cursor.x = lineLen - 1;
                    }
                }
                break;
            }

            case 'e': {
                if (this.cursor.x >= lineLen - 1) {
                    if (this.cursor.y < this.lines.length - 1) {
                        this.cursor.y++;
                        this.cursor.x = 0;
                    }
                    break;
                }

                let currentType = this.getCharClass(line[this.cursor.x + 1]);
                let foundEnd = false;

                // Scan forward to find the tail end of the current or next token
                for (let i = this.cursor.x + 1; i < lineLen; i++) {
                    let nextType = this.getCharClass(line[i + 1]);
                    if (this.getCharClass(line[i]) !== 'space' && nextType !== this.getCharClass(line[i])) {
                        this.cursor.x = i;
                        foundEnd = true;
                        break;
                    }
                }

                if (!foundEnd) {
                    this.cursor.x = lineLen - 1;
                }
                break;
            }

            case 'b': {
                if (this.cursor.x <= 0) {
                    if (this.cursor.y > 0) {
                        this.cursor.y--;
                        const prevLine = this.lines[this.cursor.y];
                        this.cursor.x = Math.max(0, prevLine.length - 1);
                    }
                    break;
                }

                let currentType = this.getCharClass(line[this.cursor.x]);
                let foundPrev = false;

                // Scan backward
                for (let i = this.cursor.x - 1; i >= 0; i--) {
                    let prevType = this.getCharClass(line[i]);
                    let nextType = this.getCharClass(line[i - 1]);
                    
                    if (prevType !== 'space' && (nextType !== prevType || i === 0)) {
                        this.cursor.x = i;
                        foundPrev = true;
                        break;
                    }
                }

                if (!foundPrev) {
                    this.cursor.x = 0;
                }
                break;
            }
            case 'f':
            case 't':
                this.searchingAction = key; // Store f or t and wait for the next key
                break;
            case '{': { // Up to previous empty line
                let found = false;
                for (let i = this.cursor.y - 1; i >= 0; i--) {
                    if (this.lines[i].trim() === "") {
                        this.cursor.y = i;
                        found = true;
                        break;
                    }
                }
                if (!found) this.cursor.y = 0;
                this.cursor.x = 0;
                break;
            }
            case '}': { // Down to next empty line
                let found = false;
                for (let i = this.cursor.y + 1; i < this.lines.length; i++) {
                    if (this.lines[i].trim() === "") {
                        this.cursor.y = i;
                        found = true;
                        break;
                    }
                }
                if (!found) this.cursor.y = this.lines.length - 1;
                this.cursor.x = 0;
                break;
            }
            // --- Level 3: Edge Cases ---
            case '0': // Absolute start of line
                this.cursor.x = 0;
                break;

            case '$': // Absolute end of line
                this.cursor.x = Math.max(0, line.length - 1);
                break;

            case '^': // First non-blank character
                const firstChar = line.search(/\S/);
                this.cursor.x = firstChar !== -1 ? firstChar : 0;
                break;
            case 'G': // Jump to bottom of file
                this.cursor.y = this.lines.length - 1;
                this.cursor.x = 0;
                break;

            case 'g': // Handle 'gg'
                if (this.pendingAction === 'g') {
                    this.cursor.y = 0;
                    this.cursor.x = 0;
                    this.pendingAction = null;
                } else {
                    this.pendingAction = 'g';
                }
                break;

        }

        if (['j', 'k'].includes(key)) {
            this.snapToLine();
        } else {
            this.preferredX = this.cursor.x;
        }

        return { ...this.cursor };
    }
    
    findChar(targetChar) {
        const line = this.lines[this.cursor.y];
        // Start searching from 1 char past the cursor
        const forwardText = line.slice(this.cursor.x + 1);
        const index = forwardText.indexOf(targetChar);

        if (index !== -1) {
            if (this.pendingAction === 'f') {
                this.cursor.x += (index + 1);
            } else if (this.pendingAction === 't') {
                this.cursor.x += index;
            }
        }

        this.pendingAction = null; // CLEAR IMMEDIATELY
        this.preferredX = this.cursor.x;
        return { ...this.cursor };
    }

    snapToLine() {
        const lineLen = this.lines[this.cursor.y].length;
        this.cursor.x = Math.min(this.preferredX, Math.max(0, lineLen - 1));
    }

    jumpToPercentage(percent) {
        const targetY = Math.floor((percent / 100) * (this.lines.length - 1));
        this.cursor.y = Math.max(0, Math.min(targetY, this.lines.length - 1));
        this.cursor.x = 0;
    }

    getPos() {
        return { ...this.cursor };
    }
}