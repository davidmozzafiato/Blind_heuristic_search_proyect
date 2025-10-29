# Proyecto: Búsquedas ciegas y heurísticas

**Asignatura:** Inteligencia Artificial

**Profesora:** Maria del Carmen Edna Marquez Marquez

## Integrantes del equipo

* [Pinto Santillán Luis David](https://github.com/davidmozzafiato)
* [Reyes Herrera Vanessa Giselle](https://github.com/gigiwi)

## Descripción

Se elaboró la presente página con propósito de ilustrar visualmente el uso de los algoritmos de búsquedas ciegas tales como Amplitud y Profundidad; de búsquedas heurísticas tales como A* y Primero el mejor.

Se hizo uso de herramientas de frontend como HTML y CSS, también de backend como Node js.

## Guía de uso

Una vez cargada la página web nos aparecerá la página de inicio, donde podremos acceder a los siguientes menús:

* [Problema](#problema) (Descripción del problema a resolver).
* [Editor](#editor) (Editar el incio, obstáculos y meta a resolver de los algoritmos).
* [Equipo](#integrantes-del-equipo) (Información detallada de las personas encargadas del proyecto).
* [Ciegas](#búsquedas-ciegas) (Búsqueda en Amplitud y Profundidad)
* [Heurísticas](#búsquedas-heurísticas) (Búsqueda A* y Primero el mejor)

![Página principal](https://raw.github.com/davidmozzafiato/Blind_heuristic_search_proyect/main/Images/1-MainPage.png)

### Problema

Aquí podemos ver con detalle la descripción del problema a solucionar.

![Página principal](https://raw.github.com/davidmozzafiato/Blind_heuristic_search_proyect/main/Images/2-Problema.png)

### Editor

Somos libres de editar las paredes, el inicio y la meta; podemos agregarlas y eliminarlas.

![Página principal](https://raw.github.com/davidmozzafiato/Blind_heuristic_search_proyect/main/Images/3-Editor.png)

### Búsquedas ciegas

Tenemos dos búsquedas disponibles, Amplitud y Profundidad; en ambos casos podemos visualizar por separado la salida tanto visual, como los datos tales como **Estados creados**, **Estados visitados** y la **Ruta solución**.

Para correr el algoritmo basta con presionar **Ejecutar algoritmo** para poder ver la salida, si en dado caso les da curiosidad ver el código con el que está trabajando el algoritmo también está disponible el botón de **Ver código Amplitud**, estos botones están dispobibles para ambas búsquedas por separado.

![Página principal](https://raw.github.com/davidmozzafiato/Blind_heuristic_search_proyect/main/Images/4-Amplitud.png)

Aquí podemos visualizar el **resultado del algoritmo** luego de presionar en **Ejecutar algoritmo**.

![Página principal](https://raw.github.com/davidmozzafiato/Blind_heuristic_search_proyect/main/Images/4-AmplitudRun.png)

Con un poco más de detalle los **Estados** y la **Ruta solución** del problema predeterminado.

![Página principal](https://raw.github.com/davidmozzafiato/Blind_heuristic_search_proyect/main/Images/4-AmplitudRunResults.png)

### Búsquedas Heurísticas

Funciona de igual manera que las [Búsquedas Ciegas](#búsquedas-ciegas).

![Página principal](https://raw.github.com/davidmozzafiato/Blind_heuristic_search_proyect/main/Images/5-AStarRun.png)

Salida de los **Estados** y la **Ruta solución** del problema predeterminado en A*(AStar).

![Página principal](https://raw.github.com/davidmozzafiato/Blind_heuristic_search_proyect/main/Images/5-AStarRunResults.png)

## Ejecución del proyecto

> [!IMPORTANT]
> Es necesario instalar [Node.js](https://nodejs.org/es/download)

### Terminal 1

> [!NOTE]
> Abrir una terminal posicionándote en la ruta del proyecto como raíz y ejecutar los siguientes comandos:

#### Instalar dependencias

```bash
make install
```

#### Inicializar servidor

```bash
make dev
```

### Terminal 2

> [!WARNING]
> Es necesario usar otra terminal distinta a la terminal 1 para evitar que se cierre el servidor

#### Abrir el servidor

```bash
make open
```

> [!IMPORTANT]
> En caso de que no se abra automáticamente la página web, usar el siguiente link:
> [http://localhost:3003](http://localhost:3003)

### Función extra

#### En caso de querer eliminar la carpeta node_module

```bash
make clean
```
