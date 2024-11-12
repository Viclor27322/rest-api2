import { Router } from "express";
import { Payment, createOrder} from "../controllers/pays.controller.js"

const router =  Router();

router.post('/create-payment-intent', Payment);
router.post('/payments/create-order', createOrder);
export default router;
