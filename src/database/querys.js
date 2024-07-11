export const querys = {
  getAllProducts: "SELECT * FROM Productos",
  getProducById: "SELECT * FROM Productos Where Id = @Id",
  addNewProduct:
    "INSERT INTO Productos (Nombre, Tipo, Descripcion) VALUES (@name,@description,@quantity);",
  deleteProduct: "DELETE FROM Productos WHERE Id= @Id",
  getTotalProducts: "SELECT COUNT(*) FROM Productos",
  updateProductById:
    "UPDATE Productos SET Nombre = @name, Tipo = @description, Descripcion = @quantity WHERE Id = @id",
};

export const querysUsers = {
  getAllUsers: "SELECT * FROM Usuario",
  getUserById: "SELECT * FROM Usuario WHERE IdUser = @IdUser",
  addNewUser: " INSERT INTO Usuario (Nombre,Correo, Pass,Registro_Pass,Telefono,Habilitado,Cuenta,Token,Logueo,IdRol, IdTipo, IdDependencia,IdPregunta,Respuesta) VALUES (@Nombre, @Correo, @Pass,@Registro_Pass,@Telefono,@Habilitado,@Cuenta, @Token,@Logueo, @IdRol, @IdTipo, NULL, @IdPregunta,@Respuesta);", 
  deleteUser: "DELETE FROM Usuarios WHERE IdUser = @IdUser",
  getTotalUsers: "SELECT COUNT(*) FROM Usuarios",
  updateUserById: "UPDATE Usuarios SET NombreUsuario = @username, CorreoElectronico = @email, Contraseña = @password WHERE Id = @id",
  getUserByEmail: "SELECT Correo FROM Usuario WHERE Correo = @Correo",
  getUserEmailExist: "SELECT * FROM Usuario WHERE Correo = @Correo",
  login: "SELECT * FROM Usuario WHERE Correo = @correo AND Pass = @pass",
  resetPassword: "UPDATE Usuario SET Pass = @Pass WHERE Token = @Token",
  getUserByToken: "SELECT * FROM Usuario WHERE Token = @Token",
  cambiarHabilitado: "UPDATE Usuario SET Habilitado = @Habilitado WHERE Token=@Token",
  getRegistroPass: "SELECT Registro_Pass FROM Usuario WHERE Correo = @Correo",
  bloquearcuenta: "UPDATE Usuario SET Cuenta = 'Bloqueado' WHERE Correo = @Correo",
  verificarCuentaBloqueada: "SELECT Cuenta from Usuario WHERE Correo = @Correo",
  verificarHabilitado: "SELECT Habilitado from Usuario WHERE Correo = @Correo",
  verificarPreguntaSeguridad: "SELECT 1 FROM Usuario WHERE Correo=@Correo AND IdPregunta=@IdPregunta AND Respuesta=@Respuesta",
  actualizarContraseña: "UPDATE Usuario SET Pass = @Pass WHERE Correo = @Correo",
};  

export const querysCitas = {
  getAllCitas: "SELECT IdCita,IdUser,IdDependencia,Citas.idPaciente, HorarioInicio, HoraFin,Descripcion,Estado, Nombre ,ApellidoP FROM Citas inner join Paciente on Citas.idPaciente = Paciente.IdPaciente",
  getCitasById: "SELECT * FROM Citas Where IdCita= @IdCita",
  getCitasDisponibles:"SELECT IdCita,IdUser,IdDependencia,Citas.idPaciente, HorarioInicio, HoraFin,Descripcion,Estado, Nombre ,ApellidoP FROM Citas inner join Paciente on Citas.idPaciente = Paciente.IdPaciente where Estado=0",
  addNewCitas: "INSERT INTO Citas (IdUser,IdDependencia, idPaciente, HorarioInicio, HoraFin, Descripcion, Estado) VALUES (@IdUser,@IdDependencia, @idPaciente, @HorarioInicio, @HoraFin, @Descripcion, @Estado)",
  deleteCita: "DELETE FROM Citas WHERE IdCita = @IdCita",
  updateCita: "UPDATE Citas SET IdPaciente=@IdPaciente, HorarioInicio=@HorarioInicio, HoraFin=@HoraFin, Descripcion=@Descripcion WHERE IdCita=@IdCita",
  updateCitaDisponible: "UPDATE Citas SET IdPaciente=@IdPaciente, Estado=1 WHERE IdCita=@IdCita",
  verificarCitasHorario: "SELECT * FROM Citas WHERE (@HorarioInicio BETWEEN HorarioInicio AND HoraFin OR @HoraFin BETWEEN HorarioInicio AND HoraFin) OR (HorarioInicio BETWEEN @HorarioInicio AND @HoraFin OR HoraFin BETWEEN @HorarioInicio AND @HoraFin);",
  verificarCitasDobles: "SELECT * FROM Citas WHERE idPaciente = @idPaciente AND CONVERT(date, HorarioInicio) = CONVERT(date, @HorarioInicio);",
  deleteCitasHorario: "DELETE FROM Citas WHERE DATEPART(dw, HorarioInicio) = @numeroDia and idPaciente=10 ",
  getAllCitasDay: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE CAST(HorarioInicio AS DATE) = CAST(GETDATE() AS DATE) order by HorarioInicio ",
  getCitasByDayOfWeek: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DATEPART(dw, HorarioInicio) = @numeroDia AND DATEPART(week, HorarioInicio) = DATEPART(week, GETDATE()) AND DATEPART(year, HorarioInicio) = DATEPART(year, GETDATE()) ORDER BY HorarioInicio",
  getCitasByDayOfWeekAndTime: "SELECT IdCita, IdUser, IdDependencia, Citas.idPaciente, HorarioInicio, HoraFin, Descripcion, Estado, Nombre, ApellidoP FROM Citas INNER JOIN Paciente ON Citas.idPaciente = Paciente.IdPaciente WHERE DATEPART(dw, HorarioInicio) = @numeroDia AND HorarioInicio >= @HoraInicio AND DATEPART(week, HorarioInicio) = DATEPART(week, GETDATE()) AND DATEPART(year, HorarioInicio) = DATEPART(year, GETDATE()) order by HorarioInicio",
}

export const querysPreguntas = {
  getAllPreguntas: "SELECT * FROM Preguntas",
  getPreguntasById: "SELECT * FROM Preguntas WHERE IdPregunta = @IdPregunta"
}

export const querysPacientes ={
  getAllPacientes: "SELECT * FROM Paciente",
  getDatosPacientes: "select IdPaciente, CONCAT(Nombre,' ', ApellidoP,' ', ApellidoM) as Nombre from Paciente",
  getPacienteById: "SELECT * FROM Paciente WHERE IdPaciente = @IdPaciente",
  insertPaciente:"INSERT INTO Paciente (Nombre, ApellidoP, ApellidoM, Correo, Telefono, fechaNacimiento) VALUES (@Nombre, @ApellidoP, @ApellidoM, @Correo, @Telefono, @fechaNacimiento)",
  updatePaciente: "UPDATE Paciente SET Nombre = @Nombre, ApellidoP = @ApellidoP, ApellidoM = @ApellidoM, Correo = @Correo, Telefono = @Telefono, fechaNacimiento = @fechaNacimiento WHERE IdPaciente = @IdPaciente",
  deletePaciente: "DELETE FROM Paciente WHERE IdPaciente = @IdPaciente",
  getPacienteByEmail: "SELECT IdPaciente FROM Paciente WHERE Correo=@Correo",
  
}

export const querysNotas ={
  getAllNotas: "SELECT * FROM Notas",
  getNotaById: "SELECT * FROM Notas WHERE IdNota = @id",
  insertNota: "INSERT INTO Notas (Titulo, Descripcion, IdUser) VALUES (@Titulo, @Descripcion, @IdUser)",
  updateNota: "UPDATE Notas SET Titulo = @Titulo, Descripcion = @Descripcion, IdUser = @IdUser WHERE IdNota = @id",
  deleteNota: "DELETE FROM Notas WHERE IdNota = @id"
}

export const querysHorarios ={
  getAllHorarios: "SELECT * FROM HorariosAtencion",
  updateHorarios: "UPDATE HorariosAtencion SET HoraInicio = @horaInicio, HoraFin = @horaFin, Estado = @estado WHERE Dia = @dia",
  getHorariosActivos: "SELECT * FROM HorariosAtencion WHERE Estado = 1",
  getHorariosDia: "SELECT * FROM HorariosAtencion WHERE Dia=@Dia"
}