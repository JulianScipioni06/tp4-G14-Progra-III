const { Router } = require("express");
const {
  getAlumnoAll,
  getAlumnoById,
  postAlumno,
  putAlumno,
  deleteAlumno
} = require("../controllers/alumno.controller");

console.log("putalumno es: ", putAlumno);
const rutas = Router();

rutas.get("/", getAlumnoAll);
rutas.get("/:legajo", getAlumnoById);

rutas.post("/", postAlumno);

rutas.put("/:legajo", putAlumno)
rutas.delete("/:legajo", deleteAlumno)

module.exports = rutas;
