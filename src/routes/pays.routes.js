import { Router } from "express";
import { Payment} from "../pays.controller"

const router =  Router();

router.post('/create-payment-intent', Payment);
export default router;
