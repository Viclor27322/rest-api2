
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
  addNewUser: "INSERT INTO Usuario (Nombre, Correo, Pass, Registro_Pass, Telefono, Habilitado, Cuenta, Token, Logueo, IdRol, IdTipo, IdDependencia, IdPregunta, Respuesta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)",
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
  deleteCitasHorario: "DELETE FROM Citas WHERE DAYOFWEEK(HorarioInicio) = ? AND idPaciente = ?",
  getAllCitasDay: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP, ApellidoM FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DATE(HorarioInicio) = DATE(NOW() - INTERVAL 6 HOUR) ORDER BY HorarioInicio;",
  getAllCitasDayHour: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP, ApellidoM FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DATE(HorarioInicio) = DATE(NOW() - INTERVAL 6 HOUR) AND TIME(HorarioInicio) > TIME(NOW() - INTERVAL 6 HOUR) ORDER BY HorarioInicio;",
  getCitasByDayOfWeek: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP, ApellidoM FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DAYOFWEEK(HorarioInicio) = ? AND WEEK(HorarioInicio) = WEEK(NOW() - INTERVAL 6 HOUR) ORDER BY HorarioInicio;",
  getCitasByDayOfWeekAndTime: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DAYOFWEEK(HorarioInicio) = ? AND HorarioInicio >= ? ORDER BY HorarioInicio",
  getCitasByPatientFullName: "SELECT C.IdCita, C.IdUser, C.IdDependencia, C.idPaciente, C.HorarioInicio, C.HoraFin, C.Descripcion, C.Estado, P.Nombre, P.ApellidoP, P.ApellidoM FROM Citas AS C INNER JOIN Paciente AS P ON C.idPaciente = P.IdPaciente WHERE P.Nombre LIKE CONCAT('%', ?, '%') AND P.ApellidoP = ? AND P.ApellidoM = ? AND DATE(HorarioInicio) > DATE(NOW() - INTERVAL 6 HOUR) ORDER BY HorarioInicio;"
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
  updateHorarios: "UPDATE HorariosAtencion SET HoraInicio = @HoraInicio, HoraFin = @HoraFin, Estado = @Estado WHERE Dia = @Dia",
  getHorariosActivos: "SELECT * FROM HorariosAtencion WHERE Estado = 1",
  getHorariosDia: "SELECT * FROM HorariosAtencion WHERE Dia = @Dia"
};
