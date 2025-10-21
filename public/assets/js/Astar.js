import {getNeighbors} from './addFunc.js';
import {reconstructPath} from './addFunc.js';
import TinyQueue from 'tinyqueue';

class Node {
    constructor(x, y, isWall = false) {
        this.x = x; this.y = y; this.isWall = isWall;
        this.g = Infinity; this.h = 0; this.f = Infinity;
        this.parent = null;
    }
}

function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
}

function astar(grid, start, end) {
    const generatedStates = [];
    const openSet = new TinyQueue([], (a, b) => a.f - b.f);
    const closedSet = new Set();
    start.g = 0;
    start.h = heuristic(start, end);
    start.f = start.g + start.h;
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
            if (closedSet.has(neighbor) || neighbor.isWall) continue;
            const tentativeG = currentNode.g + 1;

            if (tentativeG < neighbor.g) {
                neighbor.parent = currentNode;
                neighbor.g = tentativeG;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                if (!openSet.data.some(node => node === neighbor)) {
                    openSet.push(neighbor);
                    generatedStates.push(neighbor);
                }
            }
        }
    }
    return null;
}

export { astar, Node, getNeighbors, reconstructPath };