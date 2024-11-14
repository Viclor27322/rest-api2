import { getConnection } from "../database";

export const agregarFeedback = async (req, res) => {
  const { pacienteId, comentario, calificacion } = req.body;

  if (!pacienteId || !calificacion) {
    return res.status(400).json({ error: "Falta información requerida" });
  }

  try {
    const pool = await getConnection();
    await pool.query(
      `INSERT INTO feedback (pacienteId, comentario, calificacion) VALUES (?, ?, ?)`,
      [pacienteId, comentario, calificacion]
    );
    res.status(200).json({ message: "Feedback guardado exitosamente" });
  } catch (error) {
    console.error("Error al guardar feedback:", error);
    res.status(500).json({ error: "Error al guardar feedback" });
  }
};

export const verificarFeedbackExistente = async (req, res) => {
    const { pacienteId } = req.params;
    try {
      const connection = await getConnection();
      const [result] = await connection.query(
        'SELECT * FROM feedback WHERE pacienteId = ?',
        [pacienteId]
      );
      if (result.length > 0) {
        return res.json({ exists: true });
      }
      res.json({ exists: false });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const obtenerFeedback = async (req, res) => {
    const { citaId } = req.params;

    try {
        const pool = await getConnection();
        const [feedback] = await pool.query(`
            SELECT * FROM feedback
        `, [citaId]);

        res.status(200).json(feedback);
    } catch (error) {
        console.error("Error al obtener feedback:", error);
        res.status(500).json({ error: "Error al obtener feedback" });
    }
};

