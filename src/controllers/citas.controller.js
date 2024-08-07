import { getConnection, querysCitas } from "../database";
import sql from 'mssql';
import moment from "moment";
import { registrarLog } from "./log.controller";

// Función para obtener todas las citas
export const getAllCitas = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysCitas.getAllCitas);
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


export const getCitasDisponibles = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysCitas.getCitasDisponibles);
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAllCitasHoy = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysCitas.getAllCitasDay);
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const getAllCitasHoyDisponible = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysCitas.getAllCitasDayDisponible);
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const getAllProxDisponible = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysCitas.getCitasByProxDisponible);
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const getAllCitasHoyHour = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysCitas.getAllCitasDayHour);
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getCitasByDayOfWeek = async (req, res) => {
  const numeroDia = parseInt(req.params.numeroDia);
  console.log(numeroDia)
  if (isNaN(numeroDia) || numeroDia < 1 || numeroDia > 7) {
    return res.status(400).send('El número de día de la semana es inválido');
  }
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysCitas.getCitasByDayOfWeek, [numeroDia]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las citas');
  }
};



export const getCitasByDayOfWeekAndTime = async (req, res) => {
  const numeroDia = parseInt(req.params.numeroDia);
  let horaInicio = req.params.horaInicio;

  if (isNaN(numeroDia) || numeroDia < 1 || numeroDia > 7) {
    return res.status(400).send('El número de día de la semana es inválido');
  }

  const horaInicioRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if (!horaInicioRegex.test(horaInicio)) {
    return res.status(400).send('El formato de la hora de inicio es inválido');
  }

  const horaSolo = horaInicio.split(':')[0];

  try {
    const pool = await getConnection();
    const [rows] = await pool.query(`
      SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP
      FROM Citas
      INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente
      WHERE DAYOFWEEK(HorarioInicio) = ?
        AND HOUR(HorarioInicio) = ?
        AND WEEK(HorarioInicio) = WEEK(NOW())
        AND YEAR(HorarioInicio) = YEAR(NOW())
      ORDER BY HorarioInicio
    `, [numeroDia, parseInt(horaSolo)]);

    res.json(rows);
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
    const [rows] = await pool.query(querysCitas.getCitasById, [IdCita]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ msg: 'Cita no encontrada' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const addNewCita = async (req, res) => {
  const { IdUser, idPaciente, HorarioInicio, HoraFin, Descripcion } = req.body;
  const ipAddress = req.ip;

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
    await pool.query(querysCitas.addNewCitas, [IdUser, IdUser, idPaciente, HorarioInicio, HoraFin, Descripcion, 1]);
    await registrarLog(IdUser, 'Nueva cita agregada', ipAddress, 'Éxito');
    res.status(201).json({ msg: 'Cita agregada correctamente' });
  } catch (error) {
    await registrarLog(IdUser, 'Error al agregar nueva cita', ipAddress, 'Error');
    res.status(500).send(error.message);
  }
};

async function verificarCitasSuperpuestas(HorarioInicio, HoraFin) {
  const pool = await getConnection();
  const [rows] = await pool.query(querysCitas.verificarCitasHorario, [HorarioInicio, HoraFin, HorarioInicio, HoraFin, HorarioInicio, HoraFin]);
  return rows;
}

async function verificarCitasUsuarioDia(idPaciente, HorarioInicio) {
  const pool = await getConnection();
  const [rows] = await pool.query(querysCitas.verificarCitasDobles, [idPaciente, HorarioInicio]);
  return rows;
}


export const actualizarCitas = async (req, res) => {
  const { id } = req.params;
  const { IdPaciente, HorarioInicio, HoraFin, Descripcion } = req.body;

  const HorarioInicioAjustado = moment(HorarioInicio).subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss");
  const HoraFinAjustada = moment(HoraFin).subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss");

  try {
    const pool = await getConnection();
    await pool.query(querysCitas.updateCita, [IdPaciente, HorarioInicioAjustado, HoraFinAjustada, Descripcion, id]);
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
    await pool.query(querysCitas.updateCitaDisponible, [IdPaciente, id]);
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
    await pool.query(querysCitas.deleteCita, [id]);
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
          await pool.query(querysCitas.deleteCitasHorario, [numeroDia]);
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
      await pool.query(querysCitas.addNewCitas, [
          IdUser,
          IdUser, // Esto es para IdDependencia; puedes cambiarlo si es diferente
          idPaciente,
          HorarioInicio,
          HoraFin,
          Descripcion || '', // Descripción opcional
          0 // Estado predeterminado
      ]);

      return "Cita agregada correctamente";
  } catch (error) {
      throw new Error("Error al agregar la cita: " + error.message);
  }
};
;

// En tu controlador, por ejemplo, citas.controller.js
export const getCitasByPatientFullName = async (req, res) => {
  const { nombre, apellidoP, apellidoM } = req.params;
  try {
      const pool = await getConnection();
      const [rows] = await pool.query(querysCitas.getCitasByPatientFullName, [
          nombre,
          apellidoP,
          apellidoM
      ]);

      res.json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las citas');
  }
};


