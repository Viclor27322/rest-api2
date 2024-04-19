import express from "express";
import { getAllCitas,getCitasDisponibles, getCitaById, addNewCita,eliminarCita,actualizarCitas,actualizarCitasDisponibles } from "../controllers/citas.controller";

const router = express.Router();

// Rutas para citas
router.get("/citas", getAllCitas); // Obtener todas las citas
router.get("/citas-disponibles", getCitasDisponibles);
router.get("/citas/:IdCita", getCitaById); // Obtener una cita por su ID
router.post("/citas", addNewCita); // Agregar una nueva cita
router.put("/citas/:id", actualizarCitas);
router.put("/citas-disponibles/:id", actualizarCitasDisponibles);
router.delete("/citas/:id", eliminarCita); 

export default router;  
