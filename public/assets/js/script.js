document.addEventListener('DOMContentLoaded', () => {
    console.log("PASO 1: La página se ha cargado y el script.js está corriendo.");

    const gridContainer = document.getElementById('grid-container');

    // --- Selectores para BFS (Amplitud) ---
    const runButtonBFS = document.getElementById('run-bfs-btn');
    const generatedResultBFS = document.getElementById('generated-result-bfs');
    const visitedResultBFS = document.getElementById('visited-result-bfs');
    const pathResultBFS = document.getElementById('path-result-bfs');

    // --- Selectores para DFS (Profundidad) ---
    const runButtonDFS = document.getElementById('run-dfs-btn');
    const generatedResultDFS = document.getElementById('generated-result-dfs');
    const visitedResultDFS = document.getElementById('visited-result-dfs');
    const pathResultDFS = document.getElementById('path-result-dfs');

    // --- Selectores para A* ---
    const runButtonAStar = document.getElementById('run-astar-btn');
    const generatedResultAStar = document.getElementById('generated-result-astar');
    const visitedResultAStar = document.getElementById('visited-result-astar');
    const pathResultAStar = document.getElementById('path-result-astar');

    // --- Selectores para Best-First (Primero el Mejor) ---
    const runButtonBestFirst = document.getElementById('run-bestfirst-btn');
    const generatedResultBestFirst = document.getElementById('generated-result-bestfirst');
    const visitedResultBestFirst = document.getElementById('visited-result-bestfirst');
    const pathResultBestFirst = document.getElementById('path-result-bestfirst');


    // Dibuja la cuadrícula inicial (código sin cambios)
    const cuartoTemplate = [
        [".", ".", "."], [".", "#", "."], ["S", "#", "."],
        ["#", ".", "."], [".", ".", "#"], [".", "M", "."]
    ];
    const rows = cuartoTemplate.length;
    const cols = cuartoTemplate[0].length;
    // Asignamos el grid a *todos* los contenedores
    // Nota: Tu HTML actual tiene 4 contenedores con el MISMO ID "grid-container".
    // HTML no permite IDs duplicados. Deberías darles IDs únicos (ej: "grid-bfs", "grid-dfs")
    // o usar una clase (ej: class="grid-container").
    // Por ahora, asumiré que funciona visualmente, pero es una mala práctica.
    document.querySelectorAll('#grid-container, .grid-container').forEach(container => {
        container.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
        drawGrid(container);
    });


    function drawGrid(container) {
        container.innerHTML = '';
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `cell-${y}-${x}`;
                if (cuartoTemplate[y][x] === '#') cell.classList.add('wall');
                if (cuartoTemplate[y][x] === 'S') cell.classList.add('start');
                if (cuartoTemplate[y][x] === 'M') cell.classList.add('end');
                container.appendChild(cell);
            }
        }
    }

    // --- Evento del botón BFS (Amplitud) ---
    runButtonBFS.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar BFS' presionado.");
        generatedResultBFS.textContent = 'Ejecutando...';
        visitedResultBFS.textContent = 'Ejecutando...';
        pathResultBFS.textContent = 'Ejecutando...';

        try {
            const response = await fetch('/api/run/bfs');
            console.log("PASO 3: Respuesta recibida del servidor.", response);

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                generatedResultBFS.textContent = result.generated.join(', ');
                visitedResultBFS.textContent = result.visited.join(', ');
                pathResultBFS.textContent = result.path.join(' -> ');
                // Aquí iría la lógica para dibujar la ruta
            } else {
                generatedResultBFS.textContent = 'No se encontró un camino.';
                visitedResultBFS.textContent = '-';
                pathResultBFS.textContent = '-';
            }
        } catch (error) {
            console.error("PASO FALLIDO: Ocurrió un error en la comunicación con el servidor.", error);
            generatedResultBFS.textContent = `Error: ${error.message}`;
            visitedResultBFS.textContent = '-';
            pathResultBFS.textContent = '-';
        }
    });

    // --- Evento del botón DFS (Profundidad) ---
    runButtonDFS.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar Profundidad' presionado.");
        generatedResultDFS.textContent = 'Ejecutando...';
        visitedResultDFS.textContent = 'Ejecutando...';
        pathResultDFS.textContent = 'Ejecutando...';

        try {
            const response = await fetch('/api/run/dfs');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();

            if (result && result.path) {
                generatedResultDFS.textContent = result.generated.join(', ');
                visitedResultDFS.textContent = result.visited.join(', ');
                pathResultDFS.textContent = result.path.join(' -> ');
            } else {
                generatedResultDFS.textContent = 'No se encontró un camino.';
                visitedResultDFS.textContent = '-';
                pathResultDFS.textContent = '-';
            }
        } catch (error) {
            console.error("PASO FALLIDO: Ocurrió un error en la comunicación con el servidor.", error);
            generatedResultDFS.textContent = `Error: ${error.message}`;
            visitedResultDFS.textContent = '-';
            pathResultDFS.textContent = '-';
        }
    });

    // --- Evento del botón A* ---
    runButtonAStar.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar A*' presionado.");
        generatedResultAStar.textContent = 'Ejecutando...';
        visitedResultAStar.textContent = 'Ejecutando...';
        pathResultAStar.textContent = 'Ejecutando...';

        try {
            const response = await fetch('/api/run/astar');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();

            if (result && result.path) {
                generatedResultAStar.textContent = result.generated.join(', ');
                visitedResultAStar.textContent = result.visited.join(', ');
                pathResultAStar.textContent = result.path.join(' -> ');
            } else {
                generatedResultAStar.textContent = 'No se encontró un camino.';
                visitedResultAStar.textContent = '-';
                pathResultAStar.textContent = '-';
            }
        } catch (error) {
            console.error("PASO FALLIDO: Ocurrió un error en la comunicación con el servidor.", error);
            generatedResultAStar.textContent = `Error: ${error.message}`;
            visitedResultAStar.textContent = '-';
            pathResultAStar.textContent = '-';
        }
    });

    // --- Evento del botón Best-First (Primero el Mejor) ---
    runButtonBestFirst.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar Primero el Mejor' presionado.");
        generatedResultBestFirst.textContent = 'Ejecutando...';
        visitedResultBestFirst.textContent = 'Ejecutando...';
        pathResultBestFirst.textContent = 'Ejecutando...';

        try {
            const response = await fetch('/api/run/bestFirstSearch');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();

            if (result && result.path) {
                generatedResultBestFirst.textContent = result.generated.join(', ');
                visitedResultBestFirst.textContent = result.visited.join(', ');
                pathResultBestFirst.textContent = result.path.join(' -> ');
            } else {
                generatedResultBestFirst.textContent = 'No se encontró un camino.';
                visitedResultBestFirst.textContent = '-';
                pathResultBestFirst.textContent = '-';
            }
        } catch (error) {
            console.error("PASO FALLIDO: Ocurrió un error en la comunicación con el servidor.", error);
            generatedResultBestFirst.textContent = `Error: ${error.message}`;
            visitedResultBestFirst.textContent = '-';
            pathResultBestFirst.textContent = '-';
        }
    });
});