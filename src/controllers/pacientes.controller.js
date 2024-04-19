import { getConnection, querysPacientes, sql } from "../database";

export const getPacientes = async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(querysPacientes.getAllPacientes);
      res.json(result.recordset);
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      res.status(500).json({ msg: 'Error interno del servidor al obtener pacientes' });
    }
  };

export const getPacienteById = async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('IdPaciente', sql.Int, id)
        .query(querysPacientes.getPacienteById);
      if (result.recordset.length === 0) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
      }
      res.json(result.recordset[0]);
    } catch (error) {
      console.error('Error al obtener paciente por ID:', error);
      res.status(500).json({ msg: 'Error interno del servidor al obtener paciente por ID' });
    }
  };
  export const getPacienteByEmail = async (req, res) => {
    const { Correo } = req.params;
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('Correo', sql.VarChar, Correo)
        .query(querysPacientes.getPacienteByEmail);
      if (result.recordset.length === 0) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
      }
      res.json(result.recordset[0]);
    } catch (error) {
      console.error('Error al obtener paciente por correo:', error);
      res.status(500).json({ msg: 'Error interno del servidor al obtener paciente por correo' });
    }
  };
 

  export const crearPaciente = async (req, res) => {
    const { Nombre, ApellidoP, ApellidoM, Correo, Telefono, fechaNacimiento } = req.body;
    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('Nombre', sql.VarChar, Nombre)
            .input('ApellidoP', sql.VarChar, ApellidoP)
            .input('ApellidoM', sql.VarChar, ApellidoM)
            .input('Correo', sql.VarChar, Correo)
            .input('Telefono', sql.VarChar, Telefono)
            .input('fechaNacimiento', sql.Date, fechaNacimiento)
            .query(querysPacientes.insertPaciente);

        const result = await pool
            .request()
            .input('Correo', sql.VarChar, Correo)
            .query(querysPacientes.getPacienteByEmail);

        const nuevoIdPaciente = result.recordset[0].IdPaciente;

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
      await pool
        .request()
        .input('Nombre', sql.VarChar, Nombre)
        .input('ApellidoP', sql.VarChar, ApellidoP)
        .input('ApellidoM', sql.VarChar, ApellidoM)
        .input('Correo', sql.VarChar, Correo)
        .input('Telefono', sql.VarChar, Telefono)
        .input('fechaNacimiento', sql.Date, fechaNacimiento)
        .input('IdPaciente', sql.Int, id)
        .query(querysPacientes.updatePaciente);
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
      await pool
        .request()
        .input('IdPaciente', sql.Int, id)
        .query(querysPacientes.deletePaciente);
      res.json({ msg: 'Paciente eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      res.status(500).json({ msg: 'Error interno del servidor al eliminar paciente' });
    }
  };
  
  export const getPacientesDatos = async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(querysPacientes.getDatosPacientes);
      res.json(result.recordset);
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      res.status(500).json({ msg: 'Error interno del servidor al obtener pacientes' });
    }
  };