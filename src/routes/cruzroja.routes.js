const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citascruz');

router.get('/hoy', citasController.getCitasHoy);
router.get('/citas/hoy/rango', citasController.getCitasHoyRango);
router.get('/citas/hoy/limite', citasController.getCitasHoyLimite);
router.get('/citas/hoy/tipo', citasController.getCitasHoyTipo);

module.exports = router;