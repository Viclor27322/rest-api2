import { getConnection, querysCitas } from "../database";
import sql from 'mssql';
import moment from "moment";
import { registrarLog } from "./log.controller";

// Función para obtener todas las citas
export const getAllCitas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querysCitas.getAllCitas);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getCitasDisponibles = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querysCitas.getCitasDisponibles);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAllCitasHoy = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querysCitas.getAllCitasDay);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getCitasByDayOfWeek = async (req, res) => {
  const numeroDia = parseInt(req.params.numeroDia);
  if (isNaN(numeroDia) || numeroDia < 1 || numeroDia > 7) {
    return res.status(400).send('El número de día de la semana es inválido');
  }
  try {
      const pool = await getConnection();
      const result = await pool.request()
          .input('numeroDia', sql.Int, numeroDia)
          .query(querysCitas.getCitasByDayOfWeek);

      res.json(result.recordset);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las citas');
  }
};



export const getCitasByDayOfWeekAndTime = async (req, res) => {
  const numeroDia = parseInt(req.params.numeroDia);
  let horaInicio = req.params.horaInicio;
  console.log(horaInicio);

  // Verifica si el parámetro numeroDia es un número válido entre 1 y 7
  if (isNaN(numeroDia) || numeroDia < 1 || numeroDia > 7) {
    return res.status(400).send('El número de día de la semana es inválido');
  }

  // Verifica si el parámetro horaInicio es una hora válida en formato HH:MM:SS
  const horaInicioRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if (!horaInicioRegex.test(horaInicio)) {
    return res.status(400).send('El formato de la hora de inicio es inválido');
  }

  // Extraer solo la hora (HH) del parámetro horaInicio
  const horaSolo = horaInicio.split(':')[0];
  console.log(`horaSolo: ${horaSolo}`);

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('numeroDia', sql.Int, numeroDia)
      .input('HoraSolo', sql.Int, parseInt(horaSolo)) // Cambiar el tipo de input a Int
      .query(`
        SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP
        FROM Citas
        INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente
        WHERE DATEPART(dw, HorarioInicio) = @numeroDia
          AND DATEPART(hour, HorarioInicio) = @HoraSolo  -- Comparar solo la hora
          AND DATEPART(week, HorarioInicio) = DATEPART(week, GETDATE())
          AND DATEPART(year, HorarioInicio) = DATEPART(year, GETDATE())
        ORDER BY HorarioInicio
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las citas');
  }
};




// Función para obtener una cita por su ID
export const getCitaById = async (req, res) => {
  const { IdCita } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("IdCita", IdCita)
      .query(querysCitas.getCitasById);
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ msg: 'Cita no encontrada' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const addNewCita = async (req, res) => {
  const { IdUser, idPaciente, HorarioInicio, HoraFin, Descripcion} = req.body;
  const ipAddress = req.ip; // Obtener la dirección IP del cliente desde la solicitud

  const citasSuperpuestas = await verificarCitasSuperpuestas(HorarioInicio, HoraFin);
  if (citasSuperpuestas.length > 0) {
      return res.status(400).json({ msg: 'Ya existe una cita en el mismo horario' });
  }

  const citasUsuarioDia = await verificarCitasUsuarioDia(idPaciente, HorarioInicio);
  if (citasUsuarioDia.length > 0) {
      return res.status(400).json({ msg: 'El usuario ya tiene una cita agendada para este día' });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("IdUser", IdUser)
      .input("IdDependencia", IdUser)
      .input("idPaciente", idPaciente)
      .input("HorarioInicio", HorarioInicio)
      .input("HoraFin", HoraFin)
      .input("Descripcion", Descripcion)
      .input("Estado", 1)
      .query(querysCitas.addNewCitas);

    // Registrar log
    await registrarLog(IdUser, 'Nueva cita agregada', ipAddress, 'Éxito');

    res.status(201).json({ msg: 'Cita agregada correctamente' });
  } catch (error) {
    // Registrar log en caso de error
    await registrarLog(IdUser, 'Error al agregar nueva cita', ipAddress, 'Error');
    
    res.status(500).send(error.message);
  }
};

async function verificarCitasSuperpuestas(HorarioInicio, HoraFin) {
  const pool = await getConnection();
  const result = await pool
      .request()
      .input("HorarioInicio", HorarioInicio)
      .input("HoraFin", HoraFin)
      .query(querysCitas.verificarCitasHorario);
  return result.recordset;
}

async function verificarCitasUsuarioDia(idPaciente, HorarioInicio) {
  const pool = await getConnection();
  const result = await pool
      .request()
      .input("idPaciente", idPaciente)
      .input("HorarioInicio", HorarioInicio)
      .query(querysCitas.verificarCitasDobles);
  return result.recordset;
}


  export const actualizarCitas = async (req, res) => {
    const { id } = req.params;
    const { IdPaciente, HorarioInicio, HoraFin, Descripcion } = req.body;
  
    const HorarioInicioAjustado = moment(HorarioInicio).subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss");
    const HoraFinAjustada = moment(HoraFin).subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss");

    try {
      const pool = await getConnection();
      await pool
        .request()
        .input('IdPaciente', sql.Int, IdPaciente)
        .input('HorarioInicio', sql.DateTime, HorarioInicioAjustado)
        .input('HoraFin', sql.DateTime, HoraFinAjustada)
        .input('Descripcion', sql.VarChar, Descripcion)
        .input('IdCita', sql.Int, id)
        .query(querysCitas.updateCita);
  
      res.json({ msg: 'Cita actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      res.status(500).json({ msg: 'Error interno del servidor al actualizar cita' });
    }
  };
   
  export const actualizarCitasDisponibles = async (req, res) => {
    const { id } = req.params;
    const { IdPaciente } = req.body;
    try {
      const pool = await getConnection();
      await pool
        .request()
        .input('IdPaciente', sql.Int, IdPaciente)
        .input('IdCita', sql.Int, id)
        .query(querysCitas.updateCitaDisponible);
  
      res.json({ msg: 'Cita actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      res.status(500).json({ msg: 'Error interno del servidor al actualizar cita' });
    }
  };
  

  export const eliminarCita = async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await getConnection();
      await pool
        .request()
        .input('IdCita', sql.Int, id)
        .query(querysCitas.deleteCita);
      res.json({ msg: 'Cita eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      res.status(500).json({ msg: 'Error interno del servidor al eliminar cita' });
    }
  };


  const obtenerNumeroDia = (nombreDia) => {
    switch (nombreDia.toLowerCase()) {
        case 'lunes':
            return 2;
        case 'martes':
            return 3;
        case 'miércoles':
            return 4;
        case 'jueves':
            return 5;
        case 'viernes':
            return 6;
        case 'sábado':
            return 7;
        case 'domingo':
            return 1;
        default:
            return -1; // Si el nombre del día no es válido
    }
};

export const eliminarCitasPorDia = async (nombreDia) => {
    const numeroDia = obtenerNumeroDia(nombreDia);
    if (numeroDia !== -1) {
        try {
            const pool = await getConnection();
            await pool.request()
                .input('numeroDia', sql.Int, numeroDia)
                .query(querysCitas.deleteCitasHorario);
            console.log(`Citas eliminadas para el día ${nombreDia}`);
        } catch (error) {
            console.error(`Error al eliminar citas para el día ${nombreDia}:`, error);
        }
    } else {
        console.error(`El nombre del día ${nombreDia} no es válido`);
    }
};

// Crear una nueva cita específica
export const addSpecificCita = async (IdUser, idPaciente, HorarioInicio, HoraFin, Descripcion) => {
  try {
      const pool = await getConnection();
      await pool
          .request()
          .input("IdUser", sql.Int, IdUser)
          .input("IdDependencia", IdUser)
          .input("idPaciente", sql.Int, idPaciente)
          .input("HorarioInicio", sql.DateTime, HorarioInicio)
          .input("HoraFin", sql.DateTime, HoraFin)
          .input("Descripcion", sql.VarChar, Descripcion || '') // Descripción opcional
          .input("Estado", sql.Int, 0) // Estado predeterminado
          .query(querysCitas.addNewCitas); // Asigna la consulta SQL correspondiente

      return "Cita agregada correctamente";
  } catch (error) {
      throw new Error("Error al agregar la cita: " + error.message);
  }
};

// En tu controlador, por ejemplo, citas.controller.js
export const getCitasByPatientFullName = async (req, res) => {
  const { nombre, apellidoP, apellidoM } = req.params;
  console.log(nombre)
  console.log(apellidoP)
  console.log(apellidoM)
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Nombre', sql.NVarChar, nombre)
      .input('ApellidoP', sql.NVarChar, apellidoP)
      .input('ApellidoM', sql.NVarChar, apellidoM)
      .query(querysCitas.getCitasByPatientFullName);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las citas');
  }
};

