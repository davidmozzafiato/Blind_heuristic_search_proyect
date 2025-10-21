import {getNeighbors} from './addFunc.js';
import {reconstructPath} from './addFunc.js';

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

export { bfs, Node, getNeighbors, reconstructPath };