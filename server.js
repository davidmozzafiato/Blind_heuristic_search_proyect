const express = require('express');
const path = require('path');

// 1. Importa TODOS tus algoritmos
const { astar, Node } = require('./astar.js'); // Asume que Node se exporta desde astar.js
const { bfs } = require('./amplitud.js');
const { dfs } = require('./profundidad.js');
const { bestFirstSearch } = require('./primeromejor.js');

const app = express();
const PORT = 3000;

// 2. Sirve tu front-end (la carpeta 'public' donde estarán index.html y script.js)
app.use(express.static('public'));

// 3. Define el laberinto en el servidor
const cuartoTemplate = [
    [".", ".", "."], [".", "#", "."], ["S", "#", "."],
    ["#", ".", "."], [".", ".", "#"], [".", "M", "."]
];

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

// 4. Crea la API para que el front-end la llame
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
    
    res.json(result); // Envía el resultado como JSON al navegador
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});