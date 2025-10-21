document.addEventListener('DOMContentLoaded', () => {
    console.log("PASO 1: La página se ha cargado y el script.js está corriendo.");

    // --- Selectores para los contenedores de Grid (MODIFICADO) ---
    const gridBFS = document.getElementById('grid-bfs');
    const gridDFS = document.getElementById('grid-dfs');
    const gridAStar = document.getElementById('grid-astar');
    const gridBestFirst = document.getElementById('grid-bestfirst');
    // <-- NUEVO: Un array para iterar fácilmente
    const allGrids = [gridBFS, gridDFS, gridAStar, gridBestFirst]; 

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


    // Dibuja la cuadrícula inicial (código MODIFICADO)
    const cuartoTemplate = [
        [".", ".", "."], [".", "#", "."], ["S", "#", "."],
        ["#", ".", "."], [".", ".", "#"], [".", "M", "."]
    ];
    const rows = cuartoTemplate.length;
    const cols = cuartoTemplate[0].length;

    // --- Bucle MODIFICADO para dibujar en TODOS los grids ---
    allGrids.forEach(container => {
        if (container) { // Verificar que el elemento exista
            container.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
            drawGrid(container);
        }
    });

    /**
     * Dibuja el grid estático inicial en un contenedor.
     * @param {HTMLElement} container - El elemento <div> del grid.
     */
    function drawGrid(container) { // <-- MODIFICADO
        container.innerHTML = '';
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                // <-- MODIFICADO: ID Único basado en el ID del contenedor
                cell.id = `${container.id}-cell-${y}-${x}`; 
                if (cuartoTemplate[y][x] === '#') cell.classList.add('wall');
                if (cuartoTemplate[y][x] === 'S') cell.classList.add('start');
                if (cuartoTemplate[y][x] === 'M') cell.classList.add('end');
                container.appendChild(cell);
            }
        }
    }

    // --- FUNCIONES AYUDANTES (NUEVAS) ---

    /**
     * Limpia cualquier clase 'path' de un grid específico.
     * @param {string} baseId - El ID del contenedor del grid (ej: 'grid-bfs')
     */
    function clearPath(baseId) {
        const grid = document.getElementById(baseId);
        if (!grid) return;
        
        const pathCells = grid.querySelectorAll('.cell.path');
        pathCells.forEach(cell => {
            cell.classList.remove('path');
        });
    }
/**
 * Dibuja la ruta en un grid específico. (VERSIÓN CON DEPURACIÓN)
 * @param {string} baseId - El ID del contenedor del grid (ej: 'grid-bfs')
 * @param {string[]} pathArray - El array de coordenadas (ej: ['(2,0)', '(3,1)'])
 */
function drawPath(baseId, pathArray) {
    clearPath(baseId); // Limpia el grid antes de dibujar
    console.log(`--- 🎨 Iniciando drawPath para: ${baseId} ---`); // Log 1

    pathArray.forEach(coord => {
        // Parsea la coordenada de '(y, x)' a [y, x]
        const match = coord.match(/\((\d+),\s*(\d+)\)/);
        if (!match) {
            console.warn(`Formato de coordenada incorrecto: ${coord}`); // Log 2
            return; 
        }
        
        const y = match[1];
        const x = match[2];
        
        // Esta es la ID que estamos construyendo
        const cellId = `${baseId}-cell-${y}-${x}`;
        console.log(`Buscando ID de celda: ${cellId}`); // Log 3
        
        // Intenta encontrar la celda
        const cell = document.getElementById(cellId);
        
        // Comprueba si la celda fue encontrada
        if (cell) {
            // La celda existe, ahora vamos a pintarla
            if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
                cell.classList.add('path');
                console.log(`✅ -> PINTADA: ${cellId}`); // Log 4 (Éxito)
            } else {
                console.log(`⚪️ -> OMITIDA (Inicio/Fin): ${cellId}`); // Log 5 (Omitida)
            }
        } else {
            // ¡Este es el error más probable!
            console.error(`❌ -> NO ENCONTRADA: ${cellId}`); // Log 6 (¡FALLO!)
        }
    });
    console.log(`--- 🏁 Fin drawPath para: ${baseId} ---`);
}

    // --- Evento del botón BFS (Amplitud) ---
    runButtonBFS.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar BFS' presionado.");
        generatedResultBFS.textContent = 'Ejecutando...';
        visitedResultBFS.textContent = 'Ejecutando...';
        pathResultBFS.textContent = 'Ejecutando...';
        clearPath('grid-bfs'); // <-- NUEVO: Limpia la ruta visual

        try {
            const response = await fetch('/api/run/bfs');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                generatedResultBFS.textContent = result.generated.join(', ');
                visitedResultBFS.textContent = result.visited.join(', ');
                pathResultBFS.textContent = result.path.join(' -> ');
                drawPath('grid-bfs', result.path); // <-- NUEVO: Dibuja la ruta
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
        clearPath('grid-dfs'); // <-- NUEVO

        try {
            const response = await fetch('/api/run/dfs');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();

            if (result && result.path) {
                generatedResultDFS.textContent = result.generated.join(', ');
                visitedResultDFS.textContent = result.visited.join(', ');
                pathResultDFS.textContent = result.path.join(' -> ');
                drawPath('grid-dfs', result.path); // <-- NUEVO
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
        clearPath('grid-astar'); // <-- NUEVO

        try {
            const response = await fetch('/api/run/astar');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();

            if (result && result.path) {
                generatedResultAStar.textContent = result.generated.join(', ');
                visitedResultAStar.textContent = result.visited.join(', ');
                pathResultAStar.textContent = result.path.join(' -> ');
                drawPath('grid-astar', result.path); // <-- NUEVO
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
        clearPath('grid-bestfirst'); // <-- NUEVO

        try {
            const response = await fetch('/api/run/bestFirstSearch');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();

            if (result && result.path) {
                generatedResultBestFirst.textContent = result.generated.join(', ');
                visitedResultBestFirst.textContent = result.visited.join(', ');
                pathResultBestFirst.textContent = result.path.join(' -> ');
                drawPath('grid-bestfirst', result.path); // <-- NUEVO
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