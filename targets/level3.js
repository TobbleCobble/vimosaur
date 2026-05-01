export function generate(line, y, currentPos, rng) {
    const validIndices = [];
    // Target characters that are common f/t anchors: (), {}, [], ., ;, ", '
    const regex = /[(){}\[\].;,"']/g;
    let match;

    while ((match = regex.exec(line)) !== null) {
        validIndices.push(match.index);
    }

    const available = validIndices.filter(x => 
        !(x === currentPos.x && y === currentPos.y)
    );

    if (available.length === 0) return null;

    const x = available[Math.floor(rng * available.length)];
    return { x, y };
}