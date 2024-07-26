import { Router } from "express";
import { addNewFormHerida, deleteClasificacionHeridas, getAllClasificacionHeridas, getClasificacionHeridas, updateClasificacionHeridas } from "../controllers/heridas.controller"

const router =  Router();

router.post('/clasificacion_heridas', addNewFormHerida);
router.get('/clasificacion_heridas/:id', getClasificacionHeridas);
router.get('/clasificacion_heridas', getAllClasificacionHeridas);
router.put('/clasificacion_heridas/:id', updateClasificacionHeridas);
router.delete('/clasificacion_heridas/:id', deleteClasificacionHeridas);

export default router;
