const express = require('express');
const path = require('path');
const { astar, Node } = require('./public/assets/js/Astar.js');
const { bfs } = require('./public/assets/js/amplitud.js');
const { dfs } = require('./public/assets/js/profundidad.js');
const { bestFirstSearch } = require('./public/assets/js/primeromejor.js');
const defaultLaberintoData = require('./public/assets/js/laberinto.js');
const defaultLaberinto = defaultLaberintoData.default || defaultLaberintoData;
let cuartoTemplate = JSON.parse(JSON.stringify(defaultLaberinto));
const app = express();
const PORT = 3003;
app.use(express.static('public'));
app.use(express.json());
// API para pedir el laberinto
app.get('/api/grid', (req, res) => {
    // Envía la variable mutable
    res.json(cuartoTemplate);
});
// API para GUARDAR un nuevo laberinto
app.post('/api/grid', (req, res) => {
    const nuevoTemplate = req.body;
    if (nuevoTemplate && Array.isArray(nuevoTemplate)) {
        // Actualiza el laberinto EN MEMORIA
        cuartoTemplate = nuevoTemplate; 
        console.log("Laberinto actualizado en el servidor:", cuartoTemplate);
        res.json({ status: 'ok', grid: cuartoTemplate });
    } else {
        res.status(400).json({ error: 'Datos de grid inválidos' });
    }
});
app.get('/api/grid/default', (req, res) => {
    console.log("Enviando laberinto predeterminado...");
    res.json(defaultLaberinto);
});
// Esta función usa 'cuartoTemplate' (el guardado) para correr los algoritmos
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
// API para correr los algoritmos
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