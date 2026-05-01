export function generate(line, y, currentPos, rng) {
    // Prefer lines that are far from the current Y
    const isTop = y <= 1;
    const isBottom = y >= 10; // Adjust based on your code length
    
    if (!isTop && !isBottom) return null;

    const firstChar = line.search(/\S/);
    const x = firstChar !== -1 ? firstChar : 0;

    if (x === currentPos.x && y === currentPos.y) return null;

    return { x, y };
}