import { Router } from "express";
import { Payment, createOrder} from "../controllers/pays.controller.js"

const router =  Router();

router.post('/create-payment-intent', Payment);
router.post('/payment-intent', createOrder);
export default router;
