import { Router } from "express";
import { addNewFormEvaluacion, deleteClasificacionHeridas, getAllClasificacionHeridas, getClasificacionHeridas, updateClasificacionHeridas } from "../controllers/evaluacion.controller"

const router =  Router();

router.post('/evlaucion-sistematizada', addNewFormEvaluacion);
router.get('/evlaucion-sistematizada:id', getClasificacionHeridas);
router.get('/evlaucion-sistematizada', getAllClasificacionHeridas);
router.put('/evlaucion-sistematizada:id', updateClasificacionHeridas);
router.delete('/evlaucion-sistematizada:id', deleteClasificacionHeridas);

export default router;
