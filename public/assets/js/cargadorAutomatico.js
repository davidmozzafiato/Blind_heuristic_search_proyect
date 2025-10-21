// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {

    /**
     * 1. FUNCIÓN REUTILIZABLE PARA CARGAR CÓDIGO
     * (Es la misma función que hemos usado antes)
     */
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
                // Pega el texto
                elementoDestino.textContent = textoDelCodigo;
                
                // Llama a PrismJS para que lo resalte
                Prism.highlightElement(elementoDestino);
            })
            .catch(error => {
                console.error('Error al cargar el archivo:', error);
                elementoDestino.textContent = `Error al cargar ${filePath}.`;
            });
    }


    /**
     * 2. CONFIGURACIÓN DEL VIGILANTE (INTERSECTION OBSERVER)
     */
    
    // Opciones: 'threshold: 0.1' significa que se activa cuando 
    // al menos el 10% del elemento está visible.
    const opcionesObserver = {
        root: null, // Vigila en relación al viewport
        rootMargin: '0px',
        threshold: 0.1 
    };

    // Función que se ejecuta cuando un elemento vigilado cambia su visibilidad
    function callbackDelObserver(entries, observer) {
        entries.forEach(entry => {
            // entry.isIntersecting es 'true' si el elemento está en pantalla
            if (entry.isIntersecting) {
                
                const visor = entry.target; // El <code> que entró en pantalla
                
                // Leemos sus datos
                const archivo = visor.dataset.src;
                const idDestino = visor.id;

                // ¡Llamamos a la función de carga!
                cargarCodigo(archivo, idDestino);

                // IMPORTANTE: Dejamos de vigilar este elemento
                // para que no se vuelva a cargar si el usuario
                // sube y baja repetidamente.
                observer.unobserve(visor);
            }
        });
    }

    // Creamos la instancia del vigilante
    const observer = new IntersectionObserver(callbackDelObserver, opcionesObserver);

    /**
     * 3. INICIAMOS LA VIGILANCIA
     */
    
    // Buscamos TODOS los elementos que marcamos con la clase
    const todosLosVisores = document.querySelectorAll('.visor-codigo');
    
    // Le decimos al observer que vigile cada uno de ellos
    todosLosVisores.forEach(visor => {
        // Solo vigila los que realmente tienen un 'data-src'
        if (visor.dataset.src) {
            observer.observe(visor);
        }
    });

});