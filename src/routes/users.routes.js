import { Router } from "express";
import {
  getUsers,
  createNewUser,
  getUserById,
  deleteUserById,
  getTotalUsers,
  updateUserById,
  getUserByEmail,
  login,
  getEmailExist,
  resetPassword,
  cambiarHabilitado,
  bloquear,
  verificarRecuperacionPorPregunta,
  recuperarContraseñaPorPregunta
} from "../controllers/users.controller"; // Asegúrate de importar los controladores de usuarios

const router =  Router();

router.get("/users", getUsers);

router.post("/users", createNewUser);

router.get("/users/count", getTotalUsers);

router.get("/users/:IdUser", getUserById); // Cambiado a :IdUser

router.get("/users/email/:email", getUserByEmail);

router.get("/emailExist/:Correo", getEmailExist);

router.delete("/users/:id", deleteUserById);

router.put("/users/:id", updateUserById);

router.post("/users/login", login);

router.post("/users/reset-password", resetPassword);

router.post("/users/resert-Habilitado", cambiarHabilitado );

router.post("/users/bloquearCuenta", bloquear);

router.post("/users/recuperacionpregunta", verificarRecuperacionPorPregunta)

router.post("/users/reset-password-pregunta", recuperarContraseñaPorPregunta)


export default router;
