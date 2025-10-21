document.addEventListener('DOMContentLoaded', () => {
    console.log("PASO 1: La página se ha cargado.");

    // --- 1. SELECTORES DE GRID ---
    const gridBFS = document.getElementById('grid-bfs');
    const gridDFS = document.getElementById('grid-dfs');
    const gridAStar = document.getElementById('grid-astar');
    const gridBestFirst = document.getElementById('grid-bestfirst');
    const allGrids = [gridBFS, gridDFS, gridAStar, gridBestFirst];

    // --- 2. SELECTORES DE BOTONES Y RESULTADOS ---
    // BFS (Amplitud)
    const runButtonBFS = document.getElementById('run-bfs-btn');
    const generatedResultBFS = document.getElementById('generated-result-bfs');
    const visitedResultBFS = document.getElementById('visited-result-bfs');
    const pathResultBFS = document.getElementById('path-result-bfs');

    // DFS (Profundidad)
    const runButtonDFS = document.getElementById('run-dfs-btn');
    const generatedResultDFS = document.getElementById('generated-result-dfs');
    const visitedResultDFS = document.getElementById('visited-result-dfs');
    const pathResultDFS = document.getElementById('path-result-dfs');

    // A*
    const runButtonAStar = document.getElementById('run-astar-btn');
    const generatedResultAStar = document.getElementById('generated-result-astar');
    const visitedResultAStar = document.getElementById('visited-result-astar');
    const pathResultAStar = document.getElementById('path-result-astar');

    // Best-First (Primero el Mejor)
    const runButtonBestFirst = document.getElementById('run-bestfirst-btn');
    const generatedResultBestFirst = document.getElementById('generated-result-bestfirst');
    const visitedResultBestFirst = document.getElementById('visited-result-bestfirst');
    const pathResultBestFirst = document.getElementById('path-result-bestfirst');

    // --- 3. VARIABLES GLOBALES ---
    let cuartoTemplate = null;
    let rows = 0;
    let cols = 0;

    // --- 4. FUNCIONES DE LÓGICA PRINCIPAL ---

    /**
     * Pide el grid al servidor y luego lo dibuja
     */
    async function inicializarGrid() {
        try {
            console.log("PASO 2: Pidiendo grid al servidor...");
            const response = await fetch('/api/grid');
            if (!response.ok) {
                throw new Error(`Error del servidor al cargar grid: ${response.status}`);
            }
            cuartoTemplate = await response.json();
            console.log("PASO 3: Grid recibido del servidor.", cuartoTemplate);

            rows = cuartoTemplate.length;
            cols = cuartoTemplate[0].length;

            allGrids.forEach(container => {
                if (container) {
                    container.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
                    drawGrid(container); // Dibuja el grid en este contenedor
                }
            });

        } catch (error) {
            console.error("Error fatal al inicializar el grid:", error);
        }
    }

    /**
     * Dibuja el grid base en un contenedor HTML
     */
    function drawGrid(container) {
        if (!cuartoTemplate) return;
        
        container.innerHTML = ''; // Limpia el grid por si acaso
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `${container.id}-cell-${y}-${x}`; // ID único (ej: 'grid-bfs-cell-0-0')
                
                const type = cuartoTemplate[y][x];
                if (type === '#') cell.classList.add('wall');
                if (type === 'S') cell.classList.add('start');
                if (type === 'M') cell.classList.add('end');
                
                container.appendChild(cell);
            }
        }
    }

    /**
     * Limpia la ruta visual (bolas verdes) de un grid
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
     * Dibuja la ruta (bolas verdes) en un grid
     */
    function drawPath(baseId, pathArray) {
        clearPath(baseId); // Limpia la ruta anterior
        console.log(`--- 🎨 Iniciando drawPath para: ${baseId} ---`);

        pathArray.forEach(coord => {
            const match = coord.match(/\((\d+),\s*(\d+)\)/);
            if (!match) return;
            
            const y = match[1];
            const x = match[2];
            
            const cellId = `${baseId}-cell-${y}-${x}`;
            const cell = document.getElementById(cellId);
            
            if (cell) {
                if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
                    cell.classList.add('path');
                    console.log(`✅ -> PINTADA: ${cellId}`);
                } else {
                    console.log(`⚪️ -> OMITIDA (Inicio/Fin): ${cellId}`);
                }
            } else {
                // Si ves este error, 'inicializarGrid' no ha corrido bien.
                console.error(`❌ -> NO ENCONTRADA: ${cellId}`);
            }
        });
        console.log(`--- 🏁 Fin drawPath para: ${baseId} ---`);
    }

    // --- 5. EVENT LISTENERS (BOTONES) ---

    // BFS (Amplitud)
    runButtonBFS.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar BFS' presionado.");
        generatedResultBFS.textContent = 'Ejecutando...';
        visitedResultBFS.textContent = 'Ejecutando...';
        pathResultBFS.textContent = 'Ejecutando...';
        clearPath('grid-bfs');

        try {
            const response = await fetch('/api/run/bfs');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                generatedResultBFS.textContent = result.generated.join(', ');
                visitedResultBFS.textContent = result.visited.join(', ');
                pathResultBFS.textContent = result.path.join(' -> ');
                drawPath('grid-bfs', result.path);
            } else {
                pathResultBFS.textContent = 'No se encontró un camino.';
            }
        } catch (error) {
            pathResultBFS.textContent = `Error: ${error.message}`;
        }
    });

    // DFS (Profundidad)
    runButtonDFS.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar DFS' presionado.");
        generatedResultDFS.textContent = 'Ejecutando...';
        visitedResultDFS.textContent = 'Ejecutando...';
        pathResultDFS.textContent = 'Ejecutando...';
        clearPath('grid-dfs');

        try {
            const response = await fetch('/api/run/dfs');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                generatedResultDFS.textContent = result.generated.join(', ');
                visitedResultDFS.textContent = result.visited.join(', ');
                pathResultDFS.textContent = result.path.join(' -> ');
                drawPath('grid-dfs', result.path);
            } else {
                pathResultDFS.textContent = 'No se encontró un camino.';
            }
        } catch (error) {
            pathResultDFS.textContent = `Error: ${error.message}`;
        }
    });

    // A*
    runButtonAStar.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar A*' presionado.");
        generatedResultAStar.textContent = 'Ejecutando...';
        visitedResultAStar.textContent = 'Ejecutando...';
        pathResultAStar.textContent = 'Ejecutando...';
        clearPath('grid-astar');

        try {
            const response = await fetch('/api/run/astar');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                generatedResultAStar.textContent = result.generated.join(', ');
                visitedResultAStar.textContent = result.visited.join(', ');
                pathResultAStar.textContent = result.path.join(' -> ');
                drawPath('grid-astar', result.path);
            } else {
                pathResultAStar.textContent = 'No se encontró un camino.';
            }
        } catch (error) {
            pathResultAStar.textContent = `Error: ${error.message}`;
        }
    });

    // Best-First (Primero el Mejor)
    runButtonBestFirst.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar Primero el Mejor' presionado.");
        generatedResultBestFirst.textContent = 'Ejecutando...';
        visitedResultBestFirst.textContent = 'Ejecutando...';
        pathResultBestFirst.textContent = 'Ejecutando...';
        clearPath('grid-bestfirst');

        try {
            const response = await fetch('/api/run/bestFirstSearch');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                generatedResultBestFirst.textContent = result.generated.join(', ');
                visitedResultBestFirst.textContent = result.visited.join(', ');
                pathResultBestFirst.textContent = result.path.join(' -> ');
                drawPath('grid-bestfirst', result.path);
            } else {
                pathResultBestFirst.textContent = 'No se encontró un camino.';
            }
        } catch (error) {
            pathResultBestFirst.textContent = `Error: ${error.message}`;
        }
    });


    // --- 6. INICIO DE LA APLICACIÓN ---
    // Esta llamada ahora SÍ se ejecutará
    inicializarGrid();

});