import { DateTime } from "mssql";
import { getConnection, querysUsers, sql } from "../database";
import { sendRecoveryEmail } from "./email.controller";

export const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysUsers.getAllUsers);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const createNewUser = async (req, res) => {
  const { Nombre, Correo, Pass, Telefono, Registro_Pass, IdPregunta, Respuesta } = req.body;

  if (!Nombre || !Correo || !Pass || !Telefono || !Registro_Pass || !IdPregunta || !Respuesta) {
    return res.status(400).json({ msg: "Por favor rellena todos los campos" });
  }

  try {
    const pool = await getConnection();
    const randomCode = generateRandomCode();

    // Verifica si ya existe un usuario con el mismo correo
    const [userExistRows] = await pool.query(querysUsers.getUserByEmail, [Correo]);

    if (userExistRows.length > 0) {
      return res.status(400).json({ msg: "Correo electrónico ya registrado. Por favor, elige otro correo." });
    }

    // Si no hay un usuario con el mismo correo, procede a crear uno nuevo
    await pool.query(querysUsers.addNewUser, [
      Nombre,
      Correo,
      Pass,
      Registro_Pass,
      Telefono,
      'Habilitado',
      'Habilitado',
      randomCode,
      new Date(),
      1,
      4,
      IdPregunta,
      Respuesta
    ]);

    res.json({ Nombre, Correo, randomCode });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysUsers.getUserById, [req.params.IdUser]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const getEmailExist = async (req, res) => {
  const { Correo } = req.params;

  if (!Correo) {
    return res.status(400).json({ msg: "Por favor proporciona el Correo" });
  }

  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysUsers.getUserEmailExist, [Correo]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al verificar existencia de correo:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ msg: "Por favor proporciona el Correo" });
  }

  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysUsers.getUserByEmail, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send recovery email');
    }

    const { randomCode } = await response.json();
    res.json({ ...rows[0], randomCode });

  } catch (error) {
    console.error('Error al obtener usuario por correo:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const pool = await getConnection();
    const [result] = await pool.query(querysUsers.deleteUser, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const getTotalUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysUsers.getTotalUsers);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener total de usuarios:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const updateUserById = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const [result] = await pool.query(querysUsers.updateUserById, [
      username,
      email,
      password,
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ username, email });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  const { Correo, Pass } = req.body;
  console.log(Correo);
  console.log(Pass);

  // Validación
  if (!Correo || !Pass || Correo === '' || Pass === '') {
    return res.status(400).json({ msg: "Asegúrate de proporcionar correctamente el correo y contraseña" });
  }

  try {
    const pool = await getConnection();

    // Verifica si la cuenta está bloqueada
    const [cuentaBloqueadaRows] = await pool.query(querysUsers.verificarCuentaBloqueada, [Correo]);
    if (cuentaBloqueadaRows.length > 0 && cuentaBloqueadaRows[0].Cuenta === 'Bloqueado') {
      return res.status(401).json({ msg: "Tu cuenta está bloqueada. Por favor, contacta al administrador para obtener ayuda." });
    }

    // Verifica si la cuenta está habilitada
    const [cuentaHabilitadoRows] = await pool.query(querysUsers.verificarHabilitado, [Correo]);
    if (cuentaHabilitadoRows.length > 0 && cuentaHabilitadoRows[0].Cuenta === 'Bloqueado') {
      return res.status(401).json({ msg: "Tu cuenta no está habilitada. Por favor, contacta al administrador para obtener ayuda." });
    }

    // Obtener la fecha de registro de la contraseña
    const [resultaRows] = await pool.query(querysUsers.getRegistroPass, [Correo]);
    if (resultaRows.length === 0) {
      return res.status(401).json({ msg: "Correo o contraseña inválidos" });
    }

    const registroPass = resultaRows[0].Registro_Pass;
    const fechaActual = new Date();
    const fechaRegistro = new Date(registroPass);
    const diferenciaMeses = (fechaActual - fechaRegistro) / (1000 * 60 * 60 * 24 * 30); // Convertir a meses

    if (diferenciaMeses > 3) {
      return res.status(401).json({ msg: "Contraseña expirada. Por favor, restablece tu contraseña" });
    }

    const [resultRows] = await pool.query(querysUsers.login, [Correo, Pass]);
    if (resultRows.length === 0) {
      return res.status(401).json({ msg: "Correo o contraseña inválidos" });
    }

    const user = resultRows[0];
    res.json(user);

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { Token, Pass } = req.body;

  // Validación
  if (!Token || !Pass || Token === '' || Pass === '') {
    return res.status(400).json({ msg: "Bad Request. Please provide both token and new password" });
  }

  try {
    const pool = await getConnection();

    // Verifica si el usuario existe
    const [userExistRows] = await pool.query(querysUsers.getUserByToken, [Token]);
    if (userExistRows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Actualiza la contraseña del usuario
    await pool.query(querysUsers.resetPassword, [Pass, Token]);

    res.json({ msg: "Se ha restablecido la contraseña" });

  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

export const cambiarHabilitado = async (req, res) => {
  const { Token } = req.params;

  // Validación
  if (!Token || Token === '') {
    return res.status(400).json({ msg: "Bad Request. Please provide the token" });
  }

  try {
    const pool = await getConnection();

    // Verifica si el usuario existe
    const [userExistRows] = await pool.query(querysUsers.getUserByToken, [Token]);
    if (userExistRows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Cambia el estado de habilitación del usuario
    await pool.query(querysUsers.cambiarHabilitado, ['Si', Token]);

    res.json({ msg: "Habilitado actualizado exitosamente" });

  } catch (error) {
    console.error('Error al cambiar el estado de habilitación:', error);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
export const bloquear = async (req, res) => {
  const { correo } = req.body;

  try {
    const pool = await getConnection();

    // Bloquear al usuario en la base de datos
    await pool.query(querysUsers.bloquearcuenta, [correo]);

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cirupiedinfo@gmail.com',
        pass: 'efnd nsjt hpbw wzel',
      },
    });

    // Opciones del correo
    const mailOptions = {
      from: 'cirupiedinfo@gmail.com',
      to: 'cirupiedinfo@gmail.com', // Cambia esto al correo electrónico al que quieres enviar la notificación
      subject: 'Usuario bloqueado',
      html: `
        <p>Se ha bloqueado al siguiente usuario con el correo electrónico</p>
        <p>Correo electrónico: ${correo}</p>
      `,
    };

    // Envío del correo de notificación
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de notificación enviado:', info.response);

    res.json({ msg: 'Se realizó un bloqueo de tu cuenta. Verifica con el encargado para restablecer.' });
  } catch (error) {
    console.error('Error al bloquear usuario:', error);
    res.status(500).json({ msg: 'Error al bloquear usuario' });
  }
};

export const verificarRecuperacionPorPregunta = async (req, res) => {
  const { Correo, IdPregunta, Respuesta } = req.body;
  console.log(Correo);
  console.log(IdPregunta);
  console.log(Respuesta);

  try {
    const pool = await getConnection();

    // Verifica si existe un usuario con el correo electrónico y la pregunta de seguridad proporcionados
    const [userExistRows] = await pool.query(querysUsers.verificarPreguntaSeguridad, [Correo, IdPregunta, Respuesta]);

    if (userExistRows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado o respuesta incorrecta a la pregunta de seguridad" });
    }

    res.json({ msg: "Usuario Correcto" });
  } catch (error) {
    console.error('Error al verificar la recuperación de contraseña por pregunta:', error);
    res.status(500).json({ msg: 'Error interno del servidor al verificar la recuperación de contraseña' });
  }
};

export const recuperarContraseñaPorPregunta = async (req, res) => {
  const { Correo, IdPregunta, Respuesta, NuevaContraseña } = req.body;

  try {
    const pool = await getConnection();

    // Verifica si existe un usuario con el correo electrónico y la pregunta de seguridad proporcionados
    const [userExistRows] = await pool.query(querysUsers.verificarPreguntaSeguridad, [Correo, IdPregunta, Respuesta]);

    if (userExistRows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado o respuesta incorrecta a la pregunta de seguridad" });
    }

    // Actualiza la contraseña del usuario
    await pool.query(querysUsers.actualizarContraseña, [NuevaContraseña, Correo]);

    res.json({ msg: "Contraseña restablecida con éxito" });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ msg: 'Error interno del servidor al restablecer la contraseña' });
  }
};

export const validateToken = async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.status(400).send({ message: 'Token is required' });
  }

  try {
    const pool = await getConnection();
    const [resultRows] = await pool.query(querysUsers.validateToken, [token]);

    if (resultRows.length > 0) {
      res.send({ valid: true, user: resultRows[0] });
    } else {
      res.send({ valid: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error validating token' });
  }
};