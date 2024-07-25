import express from "express";
import { getAllCitas,getCitasDisponibles, getCitaById, addNewCita,eliminarCita,actualizarCitas,actualizarCitasDisponibles ,getAllCitasHoy,getCitasByDayOfWeek,getCitasByDayOfWeekAndTime, getCitasByPatientFullName, getAllCitasHoyHour, getAllCitasHoyDisponible, getAllProxDisponible} from "../controllers/citas.controller";

const router = express.Router();

// Rutas para citas
router.get("/citas", getAllCitas); // Obtener todas las citas
router.get("/citas-disponibles", getCitasDisponibles);
router.get("/citas-proximas-disponibles", getAllProxDisponible);
router.get("/citas-hoy", getAllCitasHoy);
router.get("/citas-hoy-disponibles", getAllCitasHoyDisponible);
router.get("/citas-hoy-hora", getAllCitasHoyHour);
router.get('/citas-dia/:numeroDia', getCitasByDayOfWeek);
router.get('/citas-dia-hora/:numeroDia/:horaInicio', getCitasByDayOfWeekAndTime);
router.get("/citas-paciente/:nombre/:apellidoP/:apellidoM", getCitasByPatientFullName);
router.get("/citas/:IdCita", getCitaById); // Obtener una cita por su ID
router.post("/citas", addNewCita); // Agregar una nueva cita
router.put("/citas/:id", actualizarCitas);
router.put("/citas-disponibles/:id", actualizarCitasDisponibles);
router.delete("/citas/:id", eliminarCita); 

export default router;  
