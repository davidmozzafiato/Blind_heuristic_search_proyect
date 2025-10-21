export function getNeighbors(grid, node) {
    const neighbors = [];
    const { x, y } = node;
    const rows = grid.length;
    const cols = grid[0].length;
    if (x > 0) neighbors.push(grid[y][x - 1]);          // Izquierda
    if (y > 0) neighbors.push(grid[y - 1][x]);          // Arriba
    if (x < cols - 1) neighbors.push(grid[y][x + 1]);   // Derecha
    if (y < rows - 1) neighbors.push(grid[y + 1][x]);   // Abajo
    return neighbors;
}

export function reconstructPath(endNode) {
    const path = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = currentNode.parent;
    }
    return path;
}