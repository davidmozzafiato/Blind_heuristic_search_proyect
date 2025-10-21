import {getNeighbors} from './addFunc.js';
import {reconstructPath} from './addFunc.js';

class Node {
    constructor(x, y, isWall = false) {
        this.x = x; this.y = y; this.isWall = isWall; this.parent = null;
    }
}

function dfs(grid, start, end) {
    const generatedStates = [];
    const stack = [];
    const visited = new Set();

    stack.push(start);
    generatedStates.push(start);

    while (stack.length > 0) {
        const currentNode = stack.pop();

        if (visited.has(currentNode)) {
            continue;
        }
        visited.add(currentNode);

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
                neighbor.parent = currentNode;
                stack.push(neighbor);
                if (!generatedStates.includes(neighbor)) {
                   generatedStates.push(neighbor);
                }
            }
        }
    }
    return null;
}
export { dfs, Node, getNeighbors, reconstructPath };