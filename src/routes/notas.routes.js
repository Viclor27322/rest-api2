import { Router } from "express";
import {
    getAllNotas,
    getNotaById,
    createNota,
    updateNota,
    deleteNota
} from "../controllers/notas.cotroller"

const router =  Router();

router.get('/notas',getAllNotas);
router.get('/notas/:id', getNotaById);
router.post('/notas', createNota);
router.put('/notas/:id', updateNota);
router.delete('/notas/:id', deleteNota);

export default router;
