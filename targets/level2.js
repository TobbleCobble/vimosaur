export function generate(line, y, currentPos, rng) {
    const validIndices = [];
    const regex = /\b\w+|\w+\b|[^\w\s]+/g;
    let match;

    while ((match = regex.exec(line)) !== null) {
        validIndices.push(match.index); // Start of token
        validIndices.push(match.index + match[0].length - 1); // End of token
    }

    const uniqueIndices = [...new Set(validIndices)];

    if (uniqueIndices.length === 0) return null;

    const x = uniqueIndices[Math.floor(rng * uniqueIndices.length)];

    if (x === currentPos.x && y === currentPos.y) return null;

    return { x, y };
}
