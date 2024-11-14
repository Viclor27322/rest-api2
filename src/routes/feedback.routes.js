import { Router } from "express";
import { agregarFeedback, obtenerFeedback, verificarFeedbackExistente} from "../controllers/feedback.controller.js";

const router =  Router();

router.post('/feedback', agregarFeedback);
router.post('/obtener_feedback', obtenerFeedback);
rrouter.get("/existe_feedback/:pacienteId", verificarFeedbackExistente);
export default router;
