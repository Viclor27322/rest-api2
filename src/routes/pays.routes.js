import { Router } from "express";
import { Payment} from "../controllers/pays.controller.js"

const router =  Router();

router.post('/create-payment-intent', Payment);
export default router;
