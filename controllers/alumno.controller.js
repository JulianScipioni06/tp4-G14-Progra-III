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

// editamos un alumno
const putAlumno = async (req, res) => {
  try {
    const data = await fs.readFile("./data/alumnos.json","utf-8");
    const alumnos = JSON.parse(data);

    const legajoParam = Number(req.params.legajo);
    const datosActualizar = req.body;
    // error 400
    if(!datosActualizar.nombre || !datosActualizar.apellido || !datosActualizar.email){
      return res.status(400).json({
        msg:"Error: Faltan datos obligatorios para ser actualizados (nombre, apellido, email)."
      })
    }

    const alumnoIndex = alumnos.findIndex (
      (a) => Number(a.legajo) === legajoParam
    );
    // error 404
    if (alumnoIndex === -1){
      return res.status(404).json({
        msg: `Error: No se encontró ningún alumno con el legajo ${legajoParam}`
      });
    }

    const alumnoExistente = alumnos[alumnoIndex];
    alumnos[alumnoIndex] = {
      ...alumnoExistente, //esto mantiene los datos originales como base
      nombre: datosActualizar.nombre !== undefined ? datosActualizar.nombre : alumnoExistente.nombre,
      apellido: datosActualizar.apellido !== undefined ? datosActualizar.apellido : alumnoExistente.apellido,
      email: datosActualizar.email !== undefined ? datosActualizar.email : alumnoExistente.email,
      isActive: datosActualizar.isActive !== undefined ? datosActualizar.isActive : alumnoExistente.isActive,
      modificacion: new Date().toISOString().split('T')[0]
    };
    await fs.writeFile(
      "./data/alumnos.json", JSON.stringify(alumnos, null, 2), "utf-8"
    );
    // respuesta 200
    return res.status(200).json({
      msg: "El alumno ha sido modificado con éxito",
      alumno: alumnos[alumnoIndex],
    })
  } catch (error){
    // error 500
    return res.status(500).json({
      error: "No se ha podido modificar al alumno",
      detalleExacto: error.message,
    });
  }
}

module.exports = { getAlumnoAll, getAlumnoById, postAlumno, putAlumno, };
