import { getConnection, querysNotas } from "../database";
import sql from 'mssql';


export const getAllNotas = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysNotas.getAllNotas);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener todas las notas:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const getNotaById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysNotas.getNotaById, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Nota no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la nota por su ID:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const createNota = async (req, res) => {
  const { Titulo, Descripcion } = req.body;
  try {
    const pool = await getConnection();
    await pool.query(
      querysNotas.insertNota,
      [Titulo, Descripcion, 5] // Ajusta el ID del usuario según sea necesario
    );
    res.json({ msg: 'Nota creada exitosamente' });
  } catch (error) {
    console.error('Error al crear la nota:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const updateNota = async (req, res) => {
  const { id } = req.params;
  const { Titulo, Descripcion } = req.body;
  try {
    const pool = await getConnection();
    await pool.query(
      querysNotas.updateNota,
      [Titulo, Descripcion, 5, id] // Ajusta el ID del usuario según sea necesario
    );
    res.json({ msg: 'Nota actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la nota:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const deleteNota = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    await pool.query(querysNotas.deleteNota, [id]);
    res.json({ msg: 'Nota eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la nota:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};