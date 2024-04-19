import { Router } from "express";
import {
    getPacientes,
    getPacienteById,
    getPacientesDatos,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    getPacienteByEmail
} from "../controllers/pacientes.controller"

const router =  Router();

router.get("/pacientes", getPacientes);
router.get("/pacientes-datos", getPacientesDatos);
router.post("/pacientes", crearPaciente);
router.get("/pacientes/:id", getPacienteById);
router.get("/pacientes-correo/:Correo", getPacienteByEmail);
router.put("/pacientes/:id", actualizarPaciente);
router.delete("/pacientes/:id", eliminarPaciente); 

export default router;