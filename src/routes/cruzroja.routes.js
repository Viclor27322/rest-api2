const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citascruz.controller');

router.get('/citas/hoy', citascruz.controller.getCitasHoy);
router.get('/citas/hoy/rango', citascruz.controller.getCitasHoyRango);
router.get('/citas/hoy/limite', citascruz.controller.getCitasHoyLimite);
router.get('/citas/hoy/tipo', citascruz.controller.getCitasHoyTipo);

module.exports = router;