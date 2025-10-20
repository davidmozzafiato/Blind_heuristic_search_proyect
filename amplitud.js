// No se necesitan dependencias externas

class Node {
    constructor(x, y, isWall = false) {
        this.x = x; this.y = y; this.isWall = isWall; this.parent = null;
    }
}

function bfs(grid, start, end) {
    const generatedStates = [];
    const queue = [];
    const visited = new Set();

    queue.push(start);
    visited.add(start);
    generatedStates.push(start);

    while (queue.length > 0) {
        const currentNode = queue.shift();

        if (currentNode === end) {
            const path = reconstructPath(currentNode);
            return {
                generated: generatedStates.map(n => `(${n.y}, ${n.x})`),
                visited: Array.from(visited).map(n => `(${n.y}, ${n.x})`),
                path: path.map(p => `(${p.y}, ${p.x})`)
            };
        }

        const neighbors = getNeighbors(grid, currentNode);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor) && !neighbor.isWall) {
                visited.add(neighbor);
                neighbor.parent = currentNode;
                queue.push(neighbor);
                generatedStates.push(neighbor);
            }
        }
    }
    return null;
}

function getNeighbors(grid, node) {
    const neighbors = [];
    const { x, y } = node;
    const rows = grid.length;
    const cols = grid[0].length;
    if (y > 0) neighbors.push(grid[y - 1][x]);
    if (y < rows - 1) neighbors.push(grid[y + 1][x]);
    if (x > 0) neighbors.push(grid[y][x - 1]);
    if (x < cols - 1) neighbors.push(grid[y][x + 1]);
    return neighbors;
}

function reconstructPath(endNode) {
    const path = [];
    let currentNode = endNode;
    while (currentNode !== null) { path.unshift(currentNode); currentNode = currentNode.parent; }
    return path;
}

/*
// --- Ejemplo de Uso ---
const cuartoTemplate = [
    [".", ".", "."], [".", "#", "."], ["S", "#", "."],
    ["#", ".", "."], [".", ".", "#"], [".", "M", "."]
];
const rows = cuartoTemplate.length;
const cols = cuartoTemplate[0].length;
const grid = Array.from({ length: rows }, (_, y) => Array.from({ length: cols }, (_, x) => new Node(x, y)));
let startNode, endNode;
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        if (cuartoTemplate[y][x] === '#') grid[y][x].isWall = true;
        if (cuartoTemplate[y][x] === 'S') startNode = grid[y][x];
        if (cuartoTemplate[y][x] === 'M') endNode = grid[y][x];
    }
}


const result = bfs(grid, startNode, endNode);

if (result) {
    console.log("*** Búsqueda en Amplitud *****************");
    console.log("Estados creados:", result.generated);
    console.log("Estados visitados:", result.visited);
    console.log("Ruta solucion:", result.path);

    const pathSet = new Set(result.path.map(p => p.replace(/[() ]/g, '')));
    for (let y = 0; y < rows; y++) {
        let rowStr = "";
        for (let x = 0; x < cols; x++) {
            const id = `${y},${x}`;
            if (grid[y][x].isWall) { rowStr += " # "; }
            else if (pathSet.has(id)) { rowStr += " * "; }
            else { rowStr += " . "; }
        }
        console.log(rowStr);
    }
} else { console.log("No se encontró un camino."); }
*/

module.exports = { bfs, Node, getNeighbors, reconstructPath };