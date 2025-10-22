# --- Variables ---
# Puerto y URL para el comando 'open'
PORT := 3003
URL := http://localhost:$(PORT)

# --- Detección de OS para abrir el navegador ---
# Variable para el comando de abrir, por defecto para Linux
OPEN_CMD := xdg-open

# Detecta si es macOS
ifeq ($(shell uname -s), Darwin)
	OPEN_CMD := open
# Detecta si es Windows (WSL o Git Bash)
else ifeq ($(OS), Windows_NT)
	OPEN_CMD := explorer.exe
endif


# --- Reglas ---

# .PHONY declara reglas que no producen un archivo (son solo comandos)
.PHONY: all install dev open clean

# Regla por defecto (si solo corres 'make')
all: dev

# Instala las dependencias de npm
# Esta regla 'node_modules' es inteligente:
# Solo ejecutará 'npm install' si la carpeta 'node_modules' no existe
# o si 'package.json' o 'package-lock.json' han sido modificados.
node_modules: package.json package-lock.json
	@echo "Installing Node.js dependencies..."
	npm install

# 'install' es un alias más amigable para la regla 'node_modules'
install: node_modules
	@echo "Dependencies are up to date."

# Inicia el servidor de desarrollo
# Depende de 'install', así que se asegurará de que las dependencias
# estén instaladas ANTES de intentar correr el servidor.
dev: install
	@echo "Starting development server on $(URL)..."
	npm run dev

# Abre el servidor en el navegador
# Esto debe correrse en una terminal SEPARADA.
open:
	@echo "Opening $(URL) in your browser..."
	$(OPEN_CMD) $(URL)

# Limpia los módulos instalados
clean:
	@echo "Cleaning up node_modules..."
	rm -rf node_modules