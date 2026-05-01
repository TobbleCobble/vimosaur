export function generate(line, y, currentPos, rng) {
    const validIndices = [];
    
    // 1. Target the Absolute Start (for '0')
    validIndices.push(0);
    
    // 2. Target the Absolute End (for '$')
    if (line.length > 1) {
        validIndices.push(line.length - 1);
    }
    
    // 3. Target the Indentation Start (for '^')
    // We only add this if it's different from the absolute start
    const firstCharIndex = line.search(/\S/);
    if (firstCharIndex > 0) {
        validIndices.push(firstCharIndex);
    }

    // Remove duplicates (in case of empty lines or no indent)
    const uniqueIndices = [...new Set(validIndices)];

    // Filter out the current cursor position so the target doesn't spawn under the player
    const available = uniqueIndices.filter(x => 
        !(x === currentPos.x && y === currentPos.y)
    );

    // If the line is empty or only contains the cursor, tell app.js to try another line
    if (available.length === 0) return null;

    // Pick one of the valid edges using the passed-in RNG
    const x = available[Math.floor(rng * available.length)];
    
    return { x, y };
}