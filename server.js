const express = require('express');
const path = require('path');
const { astar, Node } = require('./Astar.js'); // Solo importamos A*

const app = express();
const PORT = 3003;

// Sirve los archivos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Definición del cuarto
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

// ÚNICA RUTA DE API: Solo para A*
app.get('/api/run/astar', (req, res) => {
    console.log("LOG DEL SERVIDOR: Petición recibida en /api/run/astar");
    const { grid, startNode, endNode } = crearGrid();
    const result = astar(grid, startNode, endNode);
    console.log("LOG DEL SERVIDOR: Algoritmo A* ejecutado. Enviando resultado.");
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log("Abre esta URL en tu navegador.");
});