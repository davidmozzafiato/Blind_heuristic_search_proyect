// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    function cargarCodigo(filePath, targetId) {
        const elementoDestino = document.getElementById(targetId);
        if (!elementoDestino) {
            console.error(`Error: No se encontró el contenedor con id "${targetId}"`);
            return;
        }
        elementoDestino.textContent = `Cargando ${filePath}...`; // Mensaje de carga
        fetch(filePath)
            .then(response => {
                if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                return response.text();
            })
            .then(textoDelCodigo => {
                elementoDestino.textContent = textoDelCodigo;
                Prism.highlightElement(elementoDestino);
            })
            .catch(error => {
                console.error('Error al cargar el archivo:', error);
                elementoDestino.textContent = `Error al cargar ${filePath}.`;
            });
    }
    /**
     * INTERSECTION OBSERVER
     */
    const opcionesObserver = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    function callbackDelObserver(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const visor = entry.target;
                const archivo = visor.dataset.src;
                const idDestino = visor.id;
                cargarCodigo(archivo, idDestino);
                observer.unobserve(visor);
            }
        });
    }
    const observer = new IntersectionObserver(callbackDelObserver, opcionesObserver);
    const todosLosVisores = document.querySelectorAll('.visor-codigo');
    todosLosVisores.forEach(visor => {
        if (visor.dataset.src) {
            observer.observe(visor);
        }
    });
});