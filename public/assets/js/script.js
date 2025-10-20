document.addEventListener('DOMContentLoaded', () => {
    console.log("PASO 1: La página se ha cargado y el script.js está corriendo.");

    const gridContainer = document.getElementById('grid-container');
    const runButtonBFS = document.getElementById('run-bfs-btn');
    const pathResultBFS = document.getElementById('path-result-bfs');
    const runButtonDFS = document.getElementById('run-dfs-btn');
    const pathResultDFS = document.getElementById('path-result-dfs');
    const runButtonAStar = document.getElementById('run-astar-btn');
    const pathResultAStar = document.getElementById('path-result-astar');
    const runButtonBestFirst = document.getElementById('run-bestfirst-btn');
    const pathResultBestFirst = document.getElementById('path-result-bestfirst');

    // Dibuja la cuadrícula inicial (código sin cambios)
    const cuartoTemplate = [
        [".", ".", "."], [".", "#", "."], ["S", "#", "."],
        ["#", ".", "."], [".", ".", "#"], [".", "M", "."]
    ];
    const rows = cuartoTemplate.length;
    const cols = cuartoTemplate[0].length;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 40px)`;

    function drawGrid() {
        gridContainer.innerHTML = '';
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `cell-${y}-${x}`;
                if (cuartoTemplate[y][x] === '#') cell.classList.add('wall');
                if (cuartoTemplate[y][x] === 'S') cell.classList.add('start');
                if (cuartoTemplate[y][x] === 'M') cell.classList.add('end');
                gridContainer.appendChild(cell);
            }
        }
    }
    drawGrid();

    // Evento del botón
    /* Amplitud */
    runButtonBFS.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar BFS' presionado.");
        pathResultBFS.textContent = 'Ejecutando...';

        try {
            const response = await fetch('/api/run/bfs');
            console.log("PASO 3: Respuesta recibida del servidor.", response);

            if (!response.ok) {
                console.error("Error en la respuesta del servidor:", response.status, response.statusText);
                pathResultBFS.textContent = `Error del servidor: ${response.status}`;
                return;
            }

            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                pathResultBFS.textContent = `Ruta encontrada: ${result.path.join(' -> ')}`;
                // Aquí iría la lógica para dibujar la ruta
            } else {
                pathResultBFS.textContent = 'No se encontró un camino.';
            }
        } catch (error) {
            console.error("PASO FALLIDO: Ocurrió un error en la comunicación con el servidor.", error);
            pathResultBFS.textContent = 'Error de conexión. Revisa la consola.';
        }
    });

    /* Profundidad */
    runButtonDFS.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar Profundidad' presionado.");
        pathResultDFS.textContent = 'Ejecutando...';

        try {
            const response = await fetch('/api/run/dfs');
            console.log("PASO 3: Respuesta recibida del servidor.", response);

            if (!response.ok) {
                console.error("Error en la respuesta del servidor:", response.status, response.statusText);
                pathResultDFS.textContent = `Error del servidor: ${response.status}`;
                return;
            }

            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                pathResultDFS.textContent = `Ruta encontrada: ${result.path.join(' -> ')}`;
                // Aquí iría la lógica para dibujar la ruta
            } else {
                pathResultDFS.textContent = 'No se encontró un camino.';
            }
        } catch (error) {
            console.error("PASO FALLIDO: Ocurrió un error en la comunicación con el servidor.", error);
            pathResultDFS.textContent = 'Error de conexión. Revisa la consola.';
        }
    });
    /* A* */
    runButtonAStar.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar A*' presionado.");
        pathResultAStar.textContent = 'Ejecutando...';

        try {
            const response = await fetch('/api/run/astar');
            console.log("PASO 3: Respuesta recibida del servidor.", response);

            if (!response.ok) {
                console.error("Error en la respuesta del servidor:", response.status, response.statusText);
                pathResultAStar.textContent = `Error del servidor: ${response.status}`;
                return;
            }

            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                pathResultAStar.textContent = `Ruta encontrada: ${result.path.join(' -> ')}`;
                // Aquí iría la lógica para dibujar la ruta
            } else {
                pathResultAStar.textContent = 'No se encontró un camino.';
            }
        } catch (error) {
            console.error("PASO FALLIDO: Ocurrió un error en la comunicación con el servidor.", error);
            pathResultAStar.textContent = 'Error de conexión. Revisa la consola.';
        }
    });
    /* primero el mejor */
    runButtonBestFirst.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar Primero el Mejor' presionado.");
        pathResultBestFirst.textContent = 'Ejecutando...';

        try {
            const response = await fetch('/api/run/bestFirstSearch');
            console.log("PASO 3: Respuesta recibida del servidor.", response);

            if (!response.ok) {
                console.error("Error en la respuesta del servidor:", response.status, response.statusText);
                pathResultBestFirst.textContent = `Error del servidor: ${response.status}`;
                return;
            }

            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                pathResultBestFirst.textContent = `Ruta encontrada: ${result.path.join(' -> ')}`;
                // Aquí iría la lógica para dibujar la ruta
            } else {
                pathResultBestFirst.textContent = 'No se encontró un camino.';
            }
        } catch (error) {
            console.error("PASO FALLIDO: Ocurrió un error en la comunicación con el servidor.", error);
            pathResultBestFirst.textContent = 'Error de conexión. Revisa la consola.';
        }
    });
});