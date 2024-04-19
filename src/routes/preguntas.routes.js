import { Router } from "express";
import {
    getPreguntas,
    getPreguntasById
} from "../controllers/preguntas.controller"; 

const router = Router();

router.get("/preguntas", getPreguntas);
router.get("/preguntas/:IdPregunta", getPreguntasById); 

export default router;
