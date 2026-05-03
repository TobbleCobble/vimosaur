/**
 * Level 5 Generator: Horizontal Snipe
 * Focuses on characters that are hard to reach with 'w' 
 * but easy to target with 'f' or 't'.
 */
export function generate(line, y, currentPos, rng) {
    const validIndices = [];
    // Target common symbols used in code: (), {}, [], ", ', ;, =
    const regex = /[(){}\[\]"';=]/g;
    let match;

    while ((match = regex.exec(line)) !== null) {
        validIndices.push(match.index);
    }

    // Filter out the current cursor position
    const available = validIndices.filter(x => 
        !(x === currentPos.x && y === currentPos.y)
    );

    // Fallback: If no symbols, try to find a target at least 5 chars away
    if (available.length === 0) {
        for (let i = 0; i < line.length; i++) {
            if (Math.abs(i - currentPos.x) > 5 && !/\s/.test(line[i])) {
                available.push(i);
            }
        }
    }

    if (available.length === 0) return null;

    const x = available[Math.floor(rng * available.length)];
    return { x, y };
}