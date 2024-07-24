import { getConnection, querysPacientes } from '../database'; // Asegúrate de que `querysPacientes` contenga las consultas SQL para MySQL

export const getPacientes = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysPacientes.getAllPacientes);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ msg: 'Error interno del servidor al obtener pacientes' });
  }
};

export const getPacienteById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysPacientes.getPacienteById, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Paciente no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener paciente por ID:', error);
    res.status(500).json({ msg: 'Error interno del servidor al obtener paciente por ID' });
  }
};

export const getPacienteByEmail = async (req, res) => {
  const { Correo } = req.params;
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysPacientes.getPacienteByEmail, [Correo]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Paciente no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener paciente por correo:', error);
    res.status(500).json({ msg: 'Error interno del servidor al obtener paciente por correo' });
  }
};

export const crearPaciente = async (req, res) => {
  const { Nombre, ApellidoP, ApellidoM, Correo, Telefono, fechaNacimiento } = req.body;
  try {
    const pool = await getConnection();
    await pool.query(
      querysPacientes.insertPaciente,
      [Nombre, ApellidoP, ApellidoM, Correo, Telefono, fechaNacimiento]
    );

    const [result] = await pool.query(querysPacientes.getPacienteByEmail, [Correo]);
    const nuevoIdPaciente = result[0].IdPaciente;

    res.json({ msg: 'Paciente creado exitosamente', IdPaciente: nuevoIdPaciente });
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ msg: 'Error interno del servidor al crear paciente' });
  }
};

export const actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  const { Nombre, ApellidoP, ApellidoM, Correo, Telefono, fechaNacimiento } = req.body;
  try {
    const pool = await getConnection();
    await pool.query(
      querysPacientes.updatePaciente,
      [Nombre, ApellidoP, ApellidoM, Correo, Telefono, fechaNacimiento, id]
    );
    res.json({ msg: 'Paciente actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ msg: 'Error interno del servidor al actualizar paciente' });
  }
};

export const eliminarPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    await pool.query(querysPacientes.deletePaciente, [id]);
    res.json({ msg: 'Paciente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ msg: 'Error interno del servidor al eliminar paciente' });
  }
};

export const getPacientesDatos = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysPacientes.getDatosPacientes);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ msg: 'Error interno del servidor al obtener pacientes' });
  }
};
