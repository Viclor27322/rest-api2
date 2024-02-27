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
  addNewUser: " INSERT INTO Usuario (Nombre,Correo, Pass,Registro_Pass,Telefono,Habilitado,Cuenta,Token,Logueo,IdRol, IdTipo, IdDependencia) VALUES (@Nombre, @Correo, @Pass,@Registro_Pass,@Telefono,@Habilitado,@Cuenta, @Token,@Logueo, @IdRol, @IdTipo, NULL);", 
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
};  

