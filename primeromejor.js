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

module.exports = { bestFirstSearch, Node, getNeighbors, reconstructPath };