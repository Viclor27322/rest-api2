import { Router } from "express";
import { agregarFeedback, obtenerFeedback} from "../controllers/feedback.controller.js";

const router =  Router();

router.post('/feedback', agregarFeedback);
router.post('/obtener_feedback', obtenerFeedback);
export default router;
