export function generate(line, y, currentPos, rng) {
    const x = Math.floor(rng * line.length);
    
    // Safety check to ensure we don't spawn on the cursor
    if (x === currentPos.x && y === currentPos.y) return null;
    
    return { x, y };
}