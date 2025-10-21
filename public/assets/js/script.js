document.addEventListener('DOMContentLoaded', () => {
    console.log("PASO 1: La página se ha cargado.");

    // --- 1. SELECTORES DE GRID ---
    const gridBFS = document.getElementById('grid-bfs');
    const gridDFS = document.getElementById('grid-dfs');
    const gridAStar = document.getElementById('grid-astar');
    const gridBestFirst = document.getElementById('grid-bestfirst');
    const allGrids = [gridBFS, gridDFS, gridAStar, gridBestFirst];

    // --- 2. SELECTORES DEL EDITOR ---
    const gridEditor = document.getElementById('grid-editor');
    const saveButton = document.getElementById('save-grid-btn');
    const saveStatus = document.getElementById('save-status');
    const brushRadios = document.querySelectorAll('input[name="brush"]');
    let currentBrush = '#'; // Valor inicial (Pared)

    // --- 3. SELECTORES DE BOTONES Y RESULTADOS ---
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

    // --- 4. VARIABLES GLOBALES ---
    let cuartoTemplate = null;
    let rows = 0;
    let cols = 0;

    // --- 5. FUNCIONES DE LÓGICA PRINCIPAL ---

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

            // Dibuja los grids de algoritmos
            allGrids.forEach(container => {
                if (container) {
                    container.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
                    drawGrid(container);
                }
            });

            // Dibuja el grid del EDITOR
            if (gridEditor) {
                gridEditor.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
                drawGrid(gridEditor); // Dibuja el grid en el editor
                gridEditor.addEventListener('click', handleGridClick); // Añade listener de clic
            }

        } catch (error) {
            console.error("Error fatal al inicializar el grid:", error);
        }
    }

    /**
     * Dibuja el grid base en un contenedor HTML
     */
    function drawGrid(container) {
        if (!cuartoTemplate) return;
        
        container.innerHTML = ''; // Limpia el grid
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `${container.id}-cell-${y}-${x}`;
                
                // --- ¡LÍNEAS AÑADIDAS! ---
                // Almacena las coordenadas directamente en el elemento
                cell.dataset.y = y;
                cell.dataset.x = x;
                // -------------------------
                
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
        clearPath(baseId);
        // console.log(`--- 🎨 Iniciando drawPath para: ${baseId} ---`);

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
                }
            }
        });
    }

    // --- 6. FUNCIONES DEL EDITOR ---

    /**
     * Maneja el clic en el grid del editor
     */
    function handleGridClick(e) {
        // Solo reacciona si se hizo clic en una CELDA
        if (!e.target.classList.contains('cell')) return;

        // --- ¡LÓGICA CAMBIADA! ---
        // Lee las coordenadas directamente desde los data attributes
        const y = parseInt(e.target.dataset.y, 10);
        const x = parseInt(e.target.dataset.x, 10);
        // -------------------------

        if (isNaN(y) || isNaN(x)) {
            console.error("No se pudieron leer las coordenadas de la celda", e.target);
            return;
        }

        updateLocalGrid(y, x, currentBrush);
    }

    /**
     * Actualiza el array 'cuartoTemplate' local y la celda visual
     */
    function updateLocalGrid(y, x, brush) {
        // Si es S o M, primero borra el S o M anterior
        if (brush === 'S' || brush === 'M') {
            findAndRemove(brush);
        }

        // Actualiza el array local
        cuartoTemplate[y][x] = brush;

        // Redibuja TODOS los grids para que estén sincronizados
        allGrids.forEach(container => {
            if (container) drawGrid(container);
        });
        if (gridEditor) drawGrid(gridEditor);
    }

    /**
     * Busca un carácter ('S' o 'M') en el grid local y lo borra (convierte en '.')
     */
    function findAndRemove(charToRemove) {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (cuartoTemplate[y][x] === charToRemove) {
                    cuartoTemplate[y][x] = '.'; // Borra el anterior
                    return;
                }
            }
        }
    }

    /**
     * Maneja el clic en el botón "Guardar"
     */
    async function handleSaveGrid() {
        saveStatus.textContent = 'Guardando...';
        try {
            const response = await fetch('/api/grid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cuartoTemplate), // Envía el grid local al servidor
            });

            if (!response.ok) {
                throw new Error('Error del servidor al guardar.');
            }

            const result = await response.json();
            cuartoTemplate = result.grid; // Sincroniza con la respuesta
            
            // Redibuja todo con el grid confirmado por el servidor
            allGrids.forEach(container => {
                if (container) drawGrid(container);
            });
            if (gridEditor) drawGrid(gridEditor);

            saveStatus.textContent = '¡Laberinto guardado!';
            setTimeout(() => { saveStatus.textContent = ''; }, 3000);

        } catch (error) {
            saveStatus.textContent = `Error: ${error.message}`;
        }
    }

    // --- 7. EVENT LISTENERS ---

    // Listeners de Algoritmos
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

    // Listeners del Editor
    brushRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentBrush = e.target.value;
        });
    });

    saveButton.addEventListener('click', handleSaveGrid);

    // --- 8. INICIO DE LA APLICACIÓN ---
    inicializarGrid();

});