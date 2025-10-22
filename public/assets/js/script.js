document.addEventListener('DOMContentLoaded', () => {
    console.log("PASO 1: La página se ha cargado.");
    // --- SELECTORES DE GRID ---
    const gridBFS = document.getElementById('grid-bfs');
    const gridDFS = document.getElementById('grid-dfs');
    const gridAStar = document.getElementById('grid-astar');
    const gridBestFirst = document.getElementById('grid-bestfirst');
    const allGrids = [gridBFS, gridDFS, gridAStar, gridBestFirst];
    // --- SELECTORES DEL EDITOR ---
    const gridEditor = document.getElementById('grid-editor');
    const saveButton = document.getElementById('save-grid-btn');
    const resetButton = document.getElementById('reset-grid-btn'); // Botón de reinicio
    const saveStatus = document.getElementById('save-status');
    const brushRadios = document.querySelectorAll('input[name="brush"]');
    let currentBrush = '#'; // Valor inicial (Pared)
    // --- SELECTORES DE BOTONES Y RESULTADOS ---
    const runButtonBFS = document.getElementById('run-bfs-btn');
    const generatedResultBFS = document.getElementById('generated-result-bfs');
    const visitedResultBFS = document.getElementById('visited-result-bfs');
    const pathResultBFS = document.getElementById('path-result-bfs');
    const runButtonDFS = document.getElementById('run-dfs-btn');
    const generatedResultDFS = document.getElementById('generated-result-dfs');
    const visitedResultDFS = document.getElementById('visited-result-dfs');
    const pathResultDFS = document.getElementById('path-result-dfs');
    const runButtonAStar = document.getElementById('run-astar-btn');
    const generatedResultAStar = document.getElementById('generated-result-astar');
    const visitedResultAStar = document.getElementById('visited-result-astar');
    const pathResultAStar = document.getElementById('path-result-astar');
    const runButtonBestFirst = document.getElementById('run-bestfirst-btn');
    const generatedResultBestFirst = document.getElementById('generated-result-bestfirst');
    const visitedResultBestFirst = document.getElementById('visited-result-bestfirst');
    const pathResultBestFirst = document.getElementById('path-result-bestfirst');
    // --- VARIABLES GLOBALES ---
    let cuartoTemplate = null;
    let rows = 0;
    let cols = 0;
    // --- FUNCIONES DE LÓGICA PRINCIPAL ---
    async function inicializarGrid() {
        try {
            console.log("PASO 2: Pidiendo grid GUARDADO al servidor...");
            const response = await fetch('/api/grid');
            if (!response.ok) {
                throw new Error(`Error del servidor al cargar grid: ${response.status}`);
            }
            const responseData = await response.json();
            cuartoTemplate = responseData.default || responseData;
            console.log("PASO 3: Grid recibido (después de extraer .default).", cuartoTemplate);
            // Validamos si el grid guardado está vacío o no es un array
            if (!cuartoTemplate || !Array.isArray(cuartoTemplate) || cuartoTemplate.length === 0) {
                console.warn("Grid guardado está vacío o es inválido. Cargando grid predeterminado...");
                const defaultResponse = await fetch('/api/grid/default');
                if (!defaultResponse.ok) {
                    throw new Error(`Error al cargar grid predeterminado: ${defaultResponse.status}`);
                }
                const defaultData = await defaultResponse.json();
                cuartoTemplate = defaultData.default || defaultData;
                console.log("PASO 3.5: Grid predeterminado cargado (después de extraer .default).", cuartoTemplate);
                // Si el predeterminado TAMBIÉN falla...
                if (!cuartoTemplate || !Array.isArray(cuartoTemplate) || cuartoTemplate.length === 0) {
                    throw new Error("Fallo crítico: El grid predeterminado también está vacío o es inválido.");
                }
            }
            rows = cuartoTemplate.length;
            cols = cuartoTemplate[0].length;
            allGrids.forEach(container => {
                if (container) {
                    container.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
                    drawGrid(container);
                }
            });
            if (gridEditor) {
                gridEditor.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
                drawGrid(gridEditor);
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
        container.innerHTML = '';
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `${container.id}-cell-${y}-${x}`;
                cell.dataset.y = y;
                cell.dataset.x = x;
                const type = cuartoTemplate[y][x];
                if (type === '#') cell.classList.add('wall');
                if (type === 'S') cell.classList.add('start');
                if (type === 'M') cell.classList.add('end');
                container.appendChild(cell);
            }
        }
    }
    /**
     * Limpia la ruta visual de un grid
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
     * Dibuja la ruta en un grid
     */
    function drawPath(baseId, pathArray) {
        clearPath(baseId);
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
    // --- FUNCIONES DEL EDITOR ---
    /**
     * Pide el grid PREDETERMINADO al servidor y lo dibuja
     */
    async function resetToDefault() {
        console.log("--- DEBUG: resetToDefault() FUE LLAMADA ---");
        try {
            console.log("Botón 'Reiniciar' presionado. Pidiendo grid PREDETERMINADO...");
            if (saveStatus) saveStatus.textContent = ''; 
            // Llama a la nueva URL que creamos en el servidor
            const response = await fetch('/api/grid/default'); 
            if (!response.ok) {
                throw new Error(`Error del servidor al cargar grid predeterminado: ${response.status}`);
            }
            cuartoTemplate = await response.json(); // Carga el grid predeterminado
            console.log("Grid predeterminado recibido.", cuartoTemplate);
            rows = cuartoTemplate.length;
            cols = cuartoTemplate[0].length;
            allGrids.forEach(container => {
                if (container) {
                    container.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
                    drawGrid(container);
                }
            });
            if (gridEditor) {
                gridEditor.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
                drawGrid(gridEditor);
            }
        } catch (error) {
            console.error("Error al reiniciar el grid:", error);
            if (saveStatus) saveStatus.textContent = "Error al reiniciar.";
        }
    }
    /**
     * Maneja el clic en el grid del editor
     */
    function handleGridClick(e) {
        if (!e.target.classList.contains('cell')) return;
        const y = parseInt(e.target.dataset.y, 10);
        const x = parseInt(e.target.dataset.x, 10);
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
        if (brush === 'S' || brush === 'M') {
            findAndRemove(brush);
        }
        cuartoTemplate[y][x] = brush;
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
                    cuartoTemplate[y][x] = '.';
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
                body: JSON.stringify(cuartoTemplate),
            });
            if (!response.ok) {
                throw new Error('Error del servidor al guardar.');
            }
            const result = await response.json();
            cuartoTemplate = result.grid;
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
    // --- EVENT LISTENERS ---
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
    if (gridEditor) {
        gridEditor.addEventListener('click', handleGridClick);
    }
    brushRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentBrush = e.target.value;
        });
    });
    saveButton.addEventListener('click', handleSaveGrid);
    if (resetButton) {
        resetButton.addEventListener('click', resetToDefault);
    }
    // --- INICIO DE LA APLICACIÓN ---
    inicializarGrid();
});