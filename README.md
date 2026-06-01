# Trabajo Práctico Nº 4 - Programación III: API REST Gestión de Alumnos

## ➢ Número de grupo e integrantes
**Grupo 14**
* Julián Scipioni
* Bautista Pozo
* Guido Strizzi
* Julián Ripa
* Joaquin Wener

---

## ➢ Nombre del proyecto y su descripción
**Nombre:** API - Gestión de Alumnos 
**Descripción:** Desarrollo de una API RESTful aplicando el patrón Arquitectura MVC (Model-View-Controller) con Node.js, Express y TypeScript. El sistema permite gestionar un registro de alumnos (Altas, Bajas, Modificaciones y Consultas) utilizando persistencia de datos estática mediante la manipulación de archivos `.json` de forma asíncrona. El proyecto está dockerizado y desplegado en Render.
> **Links del Proyecto**
> * **API en Render:** https://tp4-g14-progra-iii.onrender.com
> * **Documentacion en Postman:** https://documenter.getpostman.com/view/50291970/2sBXwnuYS3
> * **Repositorio del Front-end:** 

---

## ➢ Metodología de trabajo con Git y GitHub
Se adoptó un flujo de trabajo basado en **Ramas (Git Flow)** para evitar conflictos y mantener un historial limpio:
1. **Rama `main`**: Rama de producción, bloqueada para commits directos. Contiene la versión estable desplegada en Render.
2. **Rama `dev`**: Rama principal de integración para el entorno de desarrollo.
3. **Ramas individuales**: Cada integrante trabajó en su propia rama clonada desde `dev`.

---

## ➢ División de los archivos entre los integrantes
* **Julián Scipioni:** Creación del `Dockerfile`, configuración de entorno, despliegue en Render, armado de documentación en Postman y redacción del README.
* **Bautista Pozo:** Creación del modelo con POO y TypeScript.
* **Guido Strizzi, Julian Ripa, Joauqin Wener:** Se encargaron de hacer todos los endpoints que pedia el tp (GET, POST, PUT y DELETE).

---

## ➢ Distribución de los archivos y carpetas
El proyecto respeta la Arquitectura MVC y está distribuido de la siguiente manera:
```text
/
├── /controllers
│   └── alumno.controller.js   # Lógica de negocio y peticiones (req, res)
├── /data
│   └── alumnos.json           # Base de datos estática (Persistencia)
├── /models
│   ├── alumno.model.ts        # Clase Alumno que hereda de Persona
│   └── persona.model.ts       # Clase base
├── /routes
│   └── alumno.routes.js       # Definición de los endpoints de la API
├── .env                       # Variables de entorno
├── .gitignore                 # Archivos a ignorar por Git (node_modules, .env)
├── app.js                     # Punto de entrada de la aplicación y config de Express
├── Dockerfile                 # Configuración para la creación de la imagen Docker
├── package-lock.json          # Árbol exacto de dependencias
├── package.json               # Dependencias y scripts del proyecto
├── README.md                  # Documentación principal
└── tsconfig.json              # Configuración del compilador de TypeScript
```

## ➢ Funciones de la Api

A continuación, se detalla la lógica de negocio implementada en el controlador (`alumno.controller.js`) para cada uno de los endpoints de la API. Todas las funciones utilizan manejo de errores mediante bloques `try/catch` para devolver un status `500` en caso de fallos inesperados en el servidor.

*   **`getAlumnoAll` (GET `/alumnos`):**
    Esta función asíncrona es la encargada de leer la "base de datos". Utiliza el módulo `fs.promises.readFile` para acceder al archivo `alumnos.json`. Una vez leídos los datos en formato UTF-8, los parsea a un objeto nativo de JavaScript con `JSON.parse()` y retorna el array completo de alumnos con un status HTTP `200 OK`.

*   **`getAlumnoById` (GET `/alumnos/:legajo`):**
    Al igual que la anterior, lee y parsea el archivo JSON. Luego, extrae el legajo solicitado directamente desde la URL utilizando desestructuración (`req.params`). Utiliza el método `.find()` para iterar sobre el array de alumnos, convirtiendo el legajo del parámetro a `Number` para asegurar una comparación estricta (`===`). Si no encuentra coincidencias, frena la ejecución y retorna un status `404 Not Found` con un mensaje de error. Si lo encuentra, devuelve el objeto del alumno con status `200`.

*   **`postAlumno` (POST `/alumnos`):**
    Es la función encargada de los registros. Primero, lee el archivo JSON. Luego implementa una lógica matemática para garantizar que el legajo sea **autoincremental**: busca el legajo más alto dentro del array utilizando `Math.max()` y le suma 1. 
    Posteriormente, desestructura los datos del `req.body` y valida que existan los campos obligatorios (nombre, apellido, email). Si faltan datos, retorna un error `400 Bad Request`. Si la validación pasa, instancia un nuevo objeto utilizando la clase `AlumnoModel` (para aplicar POO y estructurar los datos), pushea este nuevo registro al array de alumnos, y sobreescribe el archivo físico con `fs.writeFile()`. Retorna un status `201 Created`.

*   **`putAlumno` (PUT `/alumnos/:legajo`):**
    Esta función gestiona las modificaciones. Recibe el legajo por URL (`req.params`) y los nuevos datos por el cuerpo (`req.body`). Incluye una validación crítica de seguridad: si el usuario intenta modificar el campo `legajo`, la API lo bloquea con un error `400`, garantizando que el legajo sea inmutable. 
    Luego, busca el índice del alumno mediante `.findIndex()`. Si no existe, retorna `404`. Si existe, actualiza las propiedades del alumno utilizando el operador *spread* (`...alumnoExistente`) para mantener intactos los datos que no fueron modificados. Finalmente, actualiza la fecha de modificación, guarda el archivo con `fs.writeFile` y retorna status `200`.

*   **`deleteAlumno` (DELETE `/alumnos/:legajo`):**
    Se encarga de las bajas. Obtiene el legajo mediante `req.params` y busca su posición en el array usando `.findIndex()`. Si el índice es `-1` (no existe), retorna un error `404`. Si lo encuentra, utiliza el método `.splice(alumnoIndex, 1)` para eliminar ese único objeto del array de forma limpia. Finalmente, guarda el array actualizado en el archivo JSON y responde con un status `200 OK` y los datos del alumno eliminado.

## Estructura de los Archivos JSON 
Existe un solo archivo JSON para uardar la informacion de los alumnos.

**alumnos.json**
```json
{
    "legajo": 10024,
    "nombre": "Catalina",
    "apellido": "Blanco",
    "email": "c.blanco@facultad.edu.ar",
    "fechaAlta": "2026-05-12",
    "modificacion": "2026-05-12",
    "isActive": true
}
```