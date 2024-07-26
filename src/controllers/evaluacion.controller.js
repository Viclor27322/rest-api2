import { getConnection, querysEvaluacion } from "../database";


export const addNewFormEvaluacion = async (req, res) => {
    const {
        IdPaciente, Tiempo, Hiperglicemia, Edad, Hipertension, Hipertrigliceridemia,
        Hipercolesterolemia, Hiperuricemia, Retinopatia, Nefropatia, Tabaquismo,
        Deformidad, Neuropatia, Presion_Plantar_Elevada, Hiperqueratosis,
        Enfermedad_Vascular_Periferica, Traumatismos, Acostumbra_Caminar_Descalzo,
        Completas, Simetricas, Trofismo_Conservado, Atrofia, Amputacion_Transfemoral,
        Amputacion_Transtibial, Amputacion_Total_Del_Pie, Amputacion_Parcial_Del_Pie,
        Amputacion_D, Amputacion_Transtibialismo_D, Amputacion_Transtibial_D,
        Amputacion_Total_D, Amputacion_Parcial_D, Amputacion_I,
        Amputacion_Transtibialismo_I, Amputacion_Transtibial_I, Amputacion_Total_I,
        Amputacion_Parcial_I, Pie_Plano_D, Pie_Valgo_D, Pie_Cavo_D, Hallux_Valgo_D,
        Dedos_En_Garra_D, Juanetillo_D, Supra_Ductos_D, Infra_Ductos_D,
        Deformidad_Por_Artropatia_De_Charcot_D, Pie_Plano_I, Pie_Valgo_I,
        Pie_Cavo_I, Hallux_Valgo_I, Dedos_En_Garra_I, Juanetillo_I,
        Supra_Ductos_I, Infra_Ductos_I, Deformidad_Por_Artropatia_De_Charcot_I,
        Edema, Edema_Blando, Edema_Duro, Edema_Frio, Edema_Caliente, Edema_D,
        Edema_Blando_D, Edema_Duro_D, Edema_Frio_D, Edema_Caliente_D, Edema_I,
        Edema_Blando_I, Edema_Duro_I, Edema_Frio_I, Edema_Caliente_I,
        Eritema, Palidez, Coloracion_Ocre, Hiperpigmentacion_Plantar, Piel_Seca, Descamacion, Localizacion_Descamacion, Ausencia_Vello,
        Eritema_D, Palidez_D, Coloracion_Ocre_D, Hiperpigmentacion_Plantar_D, Piel_Seca_D, Descamacion_D, Localizacion_Descamacion_D, Eritema_I,
        Palidez_I, Coloracion_Ocre_I, Hiperpigmentacion_Plantar_I, Piel_Seca_I, Descamacion_I, Localizacion_Descamacion_I,
        Ausencia_Vello_D, Ausencia_Vello_I, Hipotermia, Hipertermia,
        Hipotermia_D, Hipertermia_D, Hipotermia_I, Hipertermia_I
    } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.query(
            querysEvaluacion.createEvaluacion,
            [
                IdPaciente, Tiempo, Hiperglicemia, Edad, Hipertension, Hipertrigliceridemia,
                Hipercolesterolemia, Hiperuricemia, Retinopatia, Nefropatia, Tabaquismo,
                Deformidad, Neuropatia, Presion_Plantar_Elevada, Hiperqueratosis,
                Enfermedad_Vascular_Periferica, Traumatismos, Acostumbra_Caminar_Descalzo,
                Completas, Simetricas, Trofismo_Conservado, Atrofia, Amputacion_Transfemoral,
                Amputacion_Transtibial, Amputacion_Total_Del_Pie, Amputacion_Parcial_Del_Pie,
                Amputacion_D, Amputacion_Transtibialismo_D, Amputacion_Transtibial_D,
                Amputacion_Total_D, Amputacion_Parcial_D, Amputacion_I,
                Amputacion_Transtibialismo_I, Amputacion_Transtibial_I, Amputacion_Total_I,
                Amputacion_Parcial_I, Pie_Plano_D, Pie_Valgo_D, Pie_Cavo_D, Hallux_Valgo_D,
                Dedos_En_Garra_D, Juanetillo_D, Supra_Ductos_D, Infra_Ductos_D,
                Deformidad_Por_Artropatia_De_Charcot_D, Pie_Plano_I, Pie_Valgo_I,
                Pie_Cavo_I, Hallux_Valgo_I, Dedos_En_Garra_I, Juanetillo_I,
                Supra_Ductos_I, Infra_Ductos_I, Deformidad_Por_Artropatia_De_Charcot_I,
                Edema, Edema_Blando, Edema_Duro, Edema_Frio, Edema_Caliente, Edema_D,
                Edema_Blando_D, Edema_Duro_D, Edema_Frio_D, Edema_Caliente_D, Edema_I,
                Edema_Blando_I, Edema_Duro_I, Edema_Frio_I, Edema_Caliente_I,
                Eritema, Palidez, Coloracion_Ocre, Hiperpigmentacion_Plantar, Piel_Seca, Descamacion, Localizacion_Descamacion, Ausencia_Vello,
                Eritema_D, Palidez_D, Coloracion_Ocre_D, Hiperpigmentacion_Plantar_D, Piel_Seca_D, Descamacion_D, Localizacion_Descamacion_D, Eritema_I,
                Palidez_I, Coloracion_Ocre_I, Hiperpigmentacion_Plantar_I, Piel_Seca_I, Descamacion_I, Localizacion_Descamacion_I,
                Ausencia_Vello_D, Ausencia_Vello_I, Hipotermia, Hipertermia,
                Hipotermia_D, Hipertermia_D, Hipotermia_I, Hipertermia_I
            ]
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