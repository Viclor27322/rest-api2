import { Router } from "express";
import { Payment, PaymentAlevosia, createOrder, obtenerHistorialPagos} from "../controllers/pays.controller.js"

const router =  Router();

router.post('/create-payment-intent', Payment);
router.post('/create-payment-alevosia', PaymentAlevosia);
router.post('/payments/create-order', createOrder);
router.get('/historial-pagos', obtenerHistorialPagos);
export default router;
