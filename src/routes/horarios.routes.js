import { Router } from "express";
import {
    obtenerHorariosAtencion,
    actualizarHorarioAtencion
} from "../controllers/horarios.controller"; 

const router = Router();

router.get("/horarios",obtenerHorariosAtencion );
router.put("/horarios/:dia", actualizarHorarioAtencion); 

export default router;
