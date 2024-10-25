
export const querys = {
  getAllProducts: "SELECT * FROM Productos",
  getProductById: "SELECT * FROM Productos WHERE Id = @Id",
  addNewProduct:
    "INSERT INTO Productos (Nombre, Tipo, Descripcion) VALUES (@name, @type, @description);",
  deleteProduct: "DELETE FROM Productos WHERE Id = @Id",
  getTotalProducts: "SELECT COUNT(*) FROM Productos",
  updateProductById:
    "UPDATE Productos SET Nombre = @name, Tipo = @type, Descripcion = @description WHERE Id = @id",
};

export const querysUsers = {
  getAllUsers: "SELECT * FROM Usuario",
  getUserById: "SELECT * FROM Usuario WHERE IdUser = ?",
  addNewUser: "INSERT INTO Usuario (Nombre, Correo, Pass, Registro_Pass, Telefono, Habilitado, Cuenta, Token, Logueo, IdRol, IdTipo, IdDependencia, IdPregunta, Respuesta, ImagenUrl ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?,'https://res.cloudinary.com/dleyjie7k/image/upload/v1729647834/Cirupied/s4sy140felt41rqjyidz.png')",
  deleteUser: "DELETE FROM Usuario WHERE IdUser = ?",
  getTotalUsers: "SELECT COUNT(*) FROM Usuario",
  updateUserById: "UPDATE Usuario SET Nombre = ?, Correo = ?, Pass = ? WHERE IdUser = ?",
  getUserByEmail: "SELECT Correo FROM Usuario WHERE Correo = ?",
  getUserEmailExist: "SELECT * FROM Usuario WHERE Correo = ?",
  login: "SELECT * FROM Usuario WHERE Correo = ? AND Pass = ?",
  resetPassword: "UPDATE Usuario SET Pass = ?, Registro_Pass = NOW() WHERE Token = ?",
  getUserByToken: "SELECT * FROM Usuario WHERE Token = ?",
  cambiarHabilitado: "UPDATE Usuario SET Habilitado = ? WHERE Token = ?",
  getRegistroPass: "SELECT Registro_Pass FROM Usuario WHERE Correo = ?",
  bloquearcuenta: "UPDATE Usuario SET Cuenta = 'Bloqueado' WHERE Correo = ?",
  verificarCuentaBloqueada: "SELECT Cuenta FROM Usuario WHERE Correo = ?",
  verificarHabilitado: "SELECT Habilitado FROM Usuario WHERE Correo = ?",
  verificarPreguntaSeguridad: "SELECT 1 FROM Usuario WHERE Correo = ? AND IdPregunta = ? AND Respuesta = ?",
  actualizarContraseña: "UPDATE Usuario SET Pass = ?, Registro_Pass = NOW() WHERE Correo = ?",
  validateToken: "SELECT * FROM Usuario WHERE Token = ?"
};

export const querysCitas = {
  getAllCitas: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente",
  getCitasById: "SELECT * FROM Citas WHERE IdCita = ?",
  getCitasDisponibles: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE Estado = 0",
  addNewCitas: "INSERT INTO Citas (IdUser, IdDependencia, idPaciente, HorarioInicio, HoraFin, Descripcion, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
  deleteCita: "DELETE FROM Citas WHERE IdCita = ?",
  updateCita: "UPDATE Citas SET IdPaciente = ?, HorarioInicio = ?, HoraFin = ?, Descripcion = ? WHERE IdCita = ?",
  updateCitaDisponible: "UPDATE Citas SET IdPaciente = ?, Estado = 1 WHERE IdCita = ?",
  verificarCitasHorario: "SELECT * FROM Citas WHERE (? BETWEEN HorarioInicio AND HoraFin OR ? BETWEEN HorarioInicio AND HoraFin) OR (HorarioInicio BETWEEN ? AND ? OR HoraFin BETWEEN ? AND ?)",
  verificarCitasDobles: "SELECT * FROM Citas WHERE idPaciente = ? AND DATE(HorarioInicio) = DATE(?)",
  deleteCitasHorario: "DELETE FROM Citas WHERE DAYOFWEEK(HorarioInicio) = ? ",
  getAllCitasDay: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP, ApellidoM FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DATE(HorarioInicio) = DATE(NOW() - INTERVAL 6 HOUR) AND Estado = 1 ORDER BY HorarioInicio;",
  getAllCitasDayDisponible: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP, ApellidoM FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DATE(HorarioInicio) = DATE(NOW() - INTERVAL 6 HOUR) AND Estado = 0 ORDER BY HorarioInicio;",
  getAllCitasDayHour: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP, ApellidoM FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DATE(HorarioInicio) = DATE(NOW() - INTERVAL 6 HOUR) AND TIME(HorarioInicio) > TIME(NOW() - INTERVAL 6 HOUR) ORDER BY HorarioInicio;",
  getCitasByDayOfWeek: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP, ApellidoM FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DAYOFWEEK(HorarioInicio) = ? AND WEEK(HorarioInicio) = WEEK(NOW() - INTERVAL 6 HOUR) ORDER BY HorarioInicio;",
  getCitasByDayOfWeekAndTime: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DAYOFWEEK(HorarioInicio) = ? AND HorarioInicio >= ? ORDER BY HorarioInicio",
  getCitasByPatientFullName: "SELECT C.IdCita, C.IdUser, C.IdDependencia, C.idPaciente, C.HorarioInicio, C.HoraFin, C.Descripcion, C.Estado, P.Nombre, P.ApellidoP, P.ApellidoM FROM Citas AS C INNER JOIN Paciente AS P ON C.idPaciente = P.IdPaciente WHERE P.Nombre LIKE CONCAT('%', ?, '%') AND P.ApellidoP = ? AND P.ApellidoM = ? AND DATE(HorarioInicio) > DATE(NOW() - INTERVAL 6 HOUR) ORDER BY HorarioInicio;", 
  getCitasByProxDisponible: "SELECT C.IdCita, C.IdUser, C.IdDependencia, C.idPaciente, C.HorarioInicio, C.HoraFin, C.Descripcion, C.Estado, P.Nombre, P.ApellidoP, P.ApellidoM FROM Citas AS C INNER JOIN Paciente AS P ON C.idPaciente = P.IdPaciente WHERE Estado = 0 AND DATE(HorarioInicio) > DATE(NOW() - INTERVAL 6 HOUR) ORDER BY HorarioInicio;"
};

export const querysPreguntas = {
  getAllPreguntas: "SELECT * FROM Preguntas",
  getPreguntasById: "SELECT * FROM Preguntas WHERE IdPregunta = ?"
};

export const querysPacientes = {
  getAllPacientes: "SELECT * FROM Paciente",
  getDatosPacientes: "SELECT IdPaciente, CONCAT(Nombre, ' ', ApellidoP, ' ', ApellidoM) AS Nombre FROM Paciente",
  getPacienteById: "SELECT * FROM Paciente WHERE IdPaciente = ?",
  insertPaciente: "INSERT INTO Paciente (Nombre, ApellidoP, ApellidoM, Correo, Telefono, fechaNacimiento) VALUES (?, ?, ?, ?, ?, ?)",
  updatePaciente: "UPDATE Paciente SET Nombre = ?, ApellidoP = ?, ApellidoM = ?, Correo = ?, Telefono = ?, fechaNacimiento = ? WHERE IdPaciente = ?",
  deletePaciente: "DELETE FROM Paciente WHERE IdPaciente = ?",
  getPacienteByEmail: "SELECT IdPaciente FROM Paciente WHERE Correo = ?"
};

export const querysNotas = {
  getAllNotas: "SELECT * FROM Notas",
  getNotaById: "SELECT * FROM Notas WHERE IdNota = ?",
  insertNota: "INSERT INTO Notas (Titulo, Descripcion, IdUser) VALUES (?, ?, ?)",
  updateNota: "UPDATE Notas SET Titulo = ?, Descripcion = ?, IdUser = ? WHERE IdNota = ?",
  deleteNota: "DELETE FROM Notas WHERE IdNota = ?"
};


export const querysHorarios = {
  getAllHorarios: "SELECT * FROM HorariosAtencion",
  updateHorarios: "UPDATE HorariosAtencion SET HoraInicio = ?, HoraFin = ?, Estado = ? WHERE Dia = ?",
  getHorariosActivos: "SELECT * FROM HorariosAtencion WHERE Estado = 1",
  getHorariosDia: "SELECT * FROM HorariosAtencion WHERE Dia = ?"
};

export const querysHeridas = {
  insertClasificacionHeridas: "INSERT INTO ClasificacionHeridas (IdPaciente, LocalizacionInicial, AspectoTopografico, Registrar_Aspecto, NumeroZonasAfectadas, Registrar_Zonas, Isquemia, Infeccion, Edema, Neuropatia, Profundidad, Area, FaseCicatrizacion, FechaCreacion)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW() - INTERVAL 6 HOUR)",
  getClasificacionHeridas: `SELECT * FROM ClasificacionHeridas AS c inner JOIN Paciente AS p ON c.IdPaciente = p.IdPaciente WHERE IdClasificacionHeridas = ?`,
  getAllClasificacionHeridas: `SELECT * FROM ClasificacionHeridas AS c inner JOIN Paciente AS p ON c.IdPaciente = p.IdPaciente ORDER BY FechaCreacion DESC`,
  updateClasificacionHeridas: `
  UPDATE ClasificacionHeridas 
  SET LocalizacionInicial = ?, AspectoTopografico = ?, Registrar_Aspecto = ?, NumeroZonasAfectadas = ?, Registrar_Zonas = ?, Isquemia = ?, Infeccion = ?, Edema = ?, Neuropatia = ?, Profundidad = ?, Area = ?, FaseCicatrizacion = ?
  WHERE IdClasificacionHeridas = ? 
  `,
  deleteClasificacionHeridas: `
  DELETE FROM ClasificacionHeridas WHERE IdClasificacionHeridas = ?
  `
};

export const querysEvaluacion = {
  createEvaluacion : `INSERT INTO EvaluacionSistematizada (
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
      Eritema, Palidez, Coloracion_Ocre, Hiperpigmentacion_Plan
tar, Piel_Seca, Descamacion, Localizacion_Descamacion, Ausencia_Vello, 
      Eritema_D, Palidez_D, Coloracion_Ocre_D, Hiperpigmentacion_Plan
tar_D, Piel_Seca_D, Descamacion_D, Localizacion_Descamacion_D, Eritema_I, 
      Palidez_I, Coloracion_Ocre_I, Hiperpigmentacion_Plan
tar_I, Piel_Seca_I, Descamacion_I, Localizacion_Descamacion_I, 
      Ausencia_Vello_D, Ausencia_Vello_I, Hipotermia, Hipertermia, 
      Hipotermia_D, Hipertermia_D, Hipotermia_I, Hipertermia_I, FechaCreacion
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW() - INTERVAL 6 HOUR)`,
   getEvaluacionById : `SELECT * FROM EvaluacionSistematizada AS c inner JOIN Paciente AS p ON c.IdPaciente = p.IdPaciente WHERE Id = ?`,
  getAllClasificacionHeridas: `SELECT Id, Nombre, ApellidoP, ApellidoM, FechaCreacion FROM ClasificacionHeridas AS c inner JOIN Paciente AS p ON c.IdPaciente = p.IdPaciente ORDER BY FechaCreacion DESC`,
  updateClasificacionHeridas: `
  UPDATE ClasificacionHeridas 
  SET LocalizacionInicial = ?, AspectoTopografico = ?, Registrar_Aspecto = ?, NumeroZonasAfectadas = ?, Registrar_Zonas = ?, Isquemia = ?, Infeccion = ?, Edema = ?, Neuropatia = ?, Profundidad = ?, Area = ?, FaseCicatrizacion = ?
  WHERE IdClasificacionHeridas = ? 
  `,
  deleteClasificacionHeridas: `
  DELETE FROM ClasificacionHeridas WHERE IdClasificacionHeridas = ?
  `
};