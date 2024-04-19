import { getConnection, querysPreguntas, sql } from "../database";


export const getPreguntas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querysPreguntas.getAllPreguntas);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getPreguntasById= async (req, res) => {
    try {
      const pool = await getConnection();
  
      const result = await pool
        .request()
        .input("IdPregunta", req.params.IdPregunta)
        .query(querysPreguntas.getPreguntasById);
      return res.json(result.recordset[0]);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  };