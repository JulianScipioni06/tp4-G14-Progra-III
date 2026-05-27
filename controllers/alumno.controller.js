const fs = require("fs").promises;
const { AlumnoModel } = require("../models/alumno.model");

const getAlumnoAll = async (req, res) => {
  try {
    const data = await fs.readFile("./data/alumnos.json", "utf8");
    const alumnos = JSON.parse(data);

    return res.status(200).json(alumnos);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "No se puedieron obtener los datos de los alumnos" });
  }
};

const getAlumnoById = async (req, res) => {
  try {
    const data = await fs.readFile("./data/alumnos.json", "utf8");
    const alumnos = JSON.parse(data);

    const { legajo } = req.params;

    const legajoId = alumnos.find(
      (a) => a.legajo /* .toString() */ === Number(legajo),
    );

    if (!legajoId) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` });
    }

    return res.status(200).json(legajoId);
  } catch (error) {
    console.log(error);
    return res.status(500).JSON({
      error: `No se pudo obtener el detalle del alumno con legajo n° ${legajo}`,
    });
  }
};

//Creamos Un nuevo alumno
const postAlumno = async (req, res) => {
  try {
    const data = await fs.readFile("./data/alumnos.json", "utf8");
    const alumnos = JSON.parse(data);

    const nuevoAlumno = req.body;
    //Error 409 (Duplicados)
    const validarLegajo = alumnos.some(
      (alumnos) => alumnos.legajo.toString() === nuevoAlumno.legajo.toString(),
    );

    if (validarLegajo) {
      return res.status(409).json({
        msg: `Error: Ya existe un alumno con el legajo ${nuevoAlumno.legajo}`,
      });
    }
    //Error 400
    const {
      legajo,
      nombre,
      apellido,
      email,
      fechaAlta,
      modificacion,
      isActive,
    } = nuevoAlumno;

    if (!legajo || !nombre || !apellido || !email) {
      return res.status(400).json({
        msg: "Error: Faltan datos obligatorios (legajo, nombre, apellido, email)",
      });
    }

    const alumnoValido = new AlumnoModel(
      Number(legajo),
      nombre,
      apellido,
      email,
      fechaAlta || new Date().toISOString().split('T')[0],
      modificacion || new Date().toISOString().split('T')[0],
      isActive !== undefined ? isActive : true,
    );

    const alumnoParaGuardar = alumnoValido.getAllAttributes(); //Usamos el metodo de clase

    alumnos.push(alumnoParaGuardar); //Agregamos El alumno al array

    await fs.writeFile(
      "./data/alumnos.json",
      JSON.stringify(alumnos, null, 2),
      "utf-8",
    );

    return res.status(201).json({
      msg: "Alumno creado con exito",
      alumno: nuevoAlumno,
    });
  } catch (error) {
    return res.status(500).json({
      error: "No se pudo crear el alumno",
      detalleExacto: error.message,
    });
  }
};

module.exports = { getAlumnoAll, getAlumnoById, postAlumno };
