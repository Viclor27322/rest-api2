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
        const result = await pool.query(
            querysHeridas.insertClasificacionHeridas,
            [id_paciente, localizacion_inicial, aspecto_topografico, registrar_aspecto, numero_zonas_afectadas, registrar_zonas, isquemia, infeccion, edema, neuropatia, profundidad, area, fase_cicatrizacion]
        );
        console.log('Resultado de la consulta:', result);
        res.status(201).json({ msg: 'Registro agregado exitosamente.' });
    } catch (err) {
        console.error('Error en la consulta:', err); // Agrega esto para ver el error en la consola
        res.status(500).send('Error al agregar registro.');
    }
};



export const getClasificacionHeridas = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysHeridas.getClasificacionHeridas, [id]);

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
    const [rows] = await pool.query(querysHeridas.getAllClasificacionHeridas);
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
    console.log(localizacion_inicial)
    console.log(aspecto_topografico)
    console.log(registrar_aspecto)
    console.log(numero_zonas_afectadas)
    console.log(registrar_zonas)
    console.log(isquemia)
    console.log(infeccion)
    console.log(edema)
    console.log(neuropatia)
    console.log(profundidad)
    console.log(area)
    console.log(fase_cicatrizacion)

    try {
      const pool = await getConnection();
      const result = await pool.query(
        querysHeridas.updateClasificacionHeridas,
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
      const result = await pool.query(querysHeridas.deleteClasificacionHeridas, [id]);
  
      if (result.affectedRows === 0) {
        res.status(404).send('Registro no encontrado.');
      } else {
        res.status(200).send('Registro eliminado exitosamente.');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  };