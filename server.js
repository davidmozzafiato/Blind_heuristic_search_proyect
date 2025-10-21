const express = require('express');
const path = require('path');
const { astar, Node } = require('./Astar.js');
const { bfs } = require('./amplitud.js');
const { dfs } = require('./profundidad.js');
const { bestFirstSearch } = require('./primeromejor.js');

// --- PASO 1: Importa el laberinto desde el archivo maestro ---
const cuartoTemplate = require('./laberinto.js');

const app = express();
const PORT = 3003;

app.use(express.static('public'));

// --- PASO 2: Nueva API para que el frontend pida el laberinto ---
app.get('/api/grid', (req, res) => {
    res.json(cuartoTemplate);
});

// Esta función ahora usa el 'cuartoTemplate' importado
function crearGrid() {
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
    return { grid, startNode, endNode };
}

// La API para correr los algoritmos (sin cambios)
app.get('/api/run/:algorithm', (req, res) => {
    const { algorithm } = req.params;
    console.log(`Petición recibida para ejecutar: ${algorithm}`);
    
    const { grid, startNode, endNode } = crearGrid();
    let result;

    switch (algorithm) {
        case 'astar':
            result = astar(grid, startNode, endNode);
            break;
        case 'bfs':
            result = bfs(grid, startNode, endNode);
            break;
        case 'dfs':
            result = dfs(grid, startNode, endNode);
            break;
        case 'bestFirstSearch':
            result = bestFirstSearch(grid, startNode, endNode);
            break;
        default:
            return res.status(400).json({ error: 'Algoritmo no válido' });
    }
    
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});