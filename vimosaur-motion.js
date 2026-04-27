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

    move(key) {
        const lineLen = this.lines[this.cursor.y].length;

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
        }
        return { ...this.cursor };
    }

    snapToLine() {
        const lineLen = this.lines[this.cursor.y].length;
        this.cursor.x = Math.min(this.preferredX, Math.max(0, lineLen - 1));
    }

    getPos() {
        return { ...this.cursor };
    }
}