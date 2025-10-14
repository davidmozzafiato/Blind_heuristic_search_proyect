document.addEventListener('DOMContentLoaded', () => {
    console.log("PASO 1: La página se ha cargado y el script.js está corriendo.");

    const gridContainer = document.getElementById('grid-container');
    const pathResultEl = document.getElementById('path-result');
    const runButton = document.getElementById('run-astar-btn');

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
    runButton.addEventListener('click', async () => {
        console.log("PASO 2: Botón 'Ejecutar A*' presionado.");
        pathResultEl.textContent = 'Ejecutando...';

        try {
            const response = await fetch('/api/run/astar');
            console.log("PASO 3: Respuesta recibida del servidor.", response);

            if (!response.ok) {
                console.error("Error en la respuesta del servidor:", response.status, response.statusText);
                pathResultEl.textContent = `Error del servidor: ${response.status}`;
                return;
            }

            const result = await response.json();
            console.log("PASO 4: Datos JSON recibidos y procesados.", result);

            if (result && result.path) {
                pathResultEl.textContent = `Ruta encontrada: ${result.path.join(' -> ')}`;
                // Aquí iría la lógica para dibujar la ruta
            } else {
                pathResultEl.textContent = 'No se encontró un camino.';
            }
        } catch (error) {
            console.error("PASO FALLIDO: Ocurrió un error en la comunicación con el servidor.", error);
            pathResultEl.textContent = 'Error de conexión. Revisa la consola.';
        }
    });
});