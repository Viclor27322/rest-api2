import { getConnection, querysHeridas } from "../database";


export const addNewFormHerida = async (req, res) => {
    const {
        id_paciente,
        localizacion_inicial,
        aspecto_topografico,
        registrar_aspecto,
        numero_zonas_afectadas,
        registrar_zonas,
        isquemia,
        infeccion,
        edema,
        neuropatia,
        profundidad,
        area,
        fase_cicatrizacion
      } = req.body;

    try {
        const pool = await getConnection();
        await pool.query(
            querysHeridas.insertClasificacionHeridas,
            [id_paciente, localizacion_inicial, aspecto_topografico, registrar_aspecto, numero_zonas_afectadas, registrar_zonas, isquemia, infeccion, edema, neuropatia, profundidad, area, fase_cicatrizacion]
        );
        res.status(201).send('Registro agregado exitosamente.');
    } catch (err) {
        console.error(err); // Agrega esto para ver el error en la consola
        res.status(500).send('Error al agregar registro.');
    }
};


export const getClasificacionHeridas = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();
    const [rows] = await pool.query(queries.getClasificacionHeridas, [id]);

    if (rows.length === 0) {
      res.status(404).send('Registro no encontrado.');
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getAllClasificacionHeridas = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(queries.getAllClasificacionHeridas);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const updateClasificacionHeridas = async (req, res) => {
    const { id } = req.params;
    const {
      localizacion_inicial,
      aspecto_topografico,
      registrar_aspecto,
      numero_zonas_afectadas,
      registrar_zonas,
      isquemia,
      infeccion,
      edema,
      neuropatia,
      profundidad,
      area,
      fase_cicatrizacion
    } = req.body;
  
    try {
      const pool = await getConnection();
      const result = await pool.query(
        queries.updateClasificacionHeridas,
        [ localizacion_inicial, aspecto_topografico, registrar_aspecto, numero_zonas_afectadas, registrar_zonas, isquemia, infeccion, edema, neuropatia, profundidad, area, fase_cicatrizacion, id]
      );
  
      if (result.affectedRows === 0) {
        res.status(404).send('Registro no encontrado.');
      } else {
        res.status(200).send('Registro actualizado exitosamente.');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  
  export const deleteClasificacionHeridas = async (req, res) => {
    const { id } = req.params;
  
    try {
        const pool = await getConnection();
      const result = await pool.query(queries.deleteClasificacionHeridas, [id]);
  
      if (result.affectedRows === 0) {
        res.status(404).send('Registro no encontrado.');
      } else {
        res.status(200).send('Registro eliminado exitosamente.');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  };