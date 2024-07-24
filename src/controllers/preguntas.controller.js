import { getConnection, querysPreguntas } from "../database";

export const getPreguntas = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysPreguntas.getAllPreguntas);
    res.json(rows); // Enviar el resultado en formato JSON
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const getPreguntasById = async (req, res) => {
  const { IdPregunta } = req.params;
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysPreguntas.getPreguntasById, [IdPregunta]);
    
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Pregunta no encontrada' });
    }
    
    res.json(rows[0]); // Enviar el primer resultado en formato JSON
  } catch (error) {
    console.error('Error al obtener pregunta por ID:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};
