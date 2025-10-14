const express = require('express');
const path = require('path'); // Módulo de Node para trabajar con rutas de archivos

// Crear una instancia de la aplicación
const app = express();
const PORT = 3003;

// ----- MIDDLEWARE CLAVE -----
// Esto le dice a Express que sirva todos los archivos estáticos
// desde la carpeta 'public'.
app.use(express.static('public'));

// Esta ruta no es un archivo, es un endpoint que devuelve datos (JSON)
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Hola desde el servidor Express!' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});