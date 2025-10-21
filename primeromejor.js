const TinyQueue = require('tinyqueue').default;

class Node {
    constructor(x, y, isWall = false) {
        this.x = x;
        this.y = y;
        this.isWall = isWall;
        this.h = 0;
        this.parent = null;
    }
}

function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
}

function bestFirstSearch(grid, start, end) {
    const generatedStates = [];
    const openSet = new TinyQueue([], (a, b) => a.h - b.h);
    const closedSet = new Set();

    start.h = heuristic(start, end);
    openSet.push(start);
    generatedStates.push(start);

    while (openSet.length > 0) {
        const currentNode = openSet.pop();

        if (currentNode === end) {
            const path = reconstructPath(currentNode);
            return {
                generated: generatedStates.map(n => `(${n.y}, ${n.x})`),
                visited: Array.from(closedSet).map(n => `(${n.y}, ${n.x})`).concat(`(${end.y}, ${end.x})`),
                path: path.map(p => `(${p.y}, ${p.x})`)
            };
        }

        closedSet.add(currentNode);

        const neighbors = getNeighbors(grid, currentNode);
        for (const neighbor of neighbors) {
            if (closedSet.has(neighbor) || neighbor.isWall) {
                continue;
            }
            if (!openSet.data.some(node => node === neighbor)) {
                neighbor.parent = currentNode;
                neighbor.h = heuristic(neighbor, end);
                openSet.push(neighbor);
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
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = currentNode.parent;
    }
    return path;
}

///*
// Definición del cuarto
const cuartoTemplate = [
    [".", ".", "."],
    [".", "#", "."],
    ["S", "#", "."],
    ["#", ".", "."],
    [".", ".", "#"],
    [".", "M", "."]
];

const rows = cuartoTemplate.length;
const cols = cuartoTemplate[0].length;
const grid = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => new Node(x, y))
);

let startNode, endNode;
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        if (cuartoTemplate[y][x] === '#') grid[y][x].isWall = true;
        if (cuartoTemplate[y][x] === 'S') startNode = grid[y][x];
        if (cuartoTemplate[y][x] === 'M') endNode = grid[y][x];
    }
}

// Ejecutar el algoritmo
const result = bestFirstSearch(grid, startNode, endNode);

// Mostrar resultados
if (result) {
    console.log("*** Búsqueda Primero el Mejor *****************");
    console.log("Estados creados:", result.generated);
    console.log("Estados visitados:", result.visited);
    console.log("Ruta solucion:", result.path);

    const pathSet = new Set(result.path.map(p => p.replace(/[() ]/g, '')));
    for (let y = 0; y < rows; y++) {
        let rowStr = "";
        for (let x = 0; x < cols; x++) {
            const id = `${y},${x}`;
            if (grid[y][x].isWall) {
                rowStr += " # ";
            } else if (pathSet.has(id)) {
                rowStr += " * ";
            } else {
                rowStr += " . ";
            }
        }
        console.log(rowStr);
    }
} else {
    console.log("No se encontró un camino.");
}
//*/

module.exports = { bestFirstSearch, Node, getNeighbors, reconstructPath };