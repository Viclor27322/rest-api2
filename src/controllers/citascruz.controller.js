const sql = require('mssql');

// Obtener todas las citas de hoy
exports.getCitasHoy = async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT * FROM Citas_CruzRoja
            WHERE fecha = CAST(GETDATE() AS DATE)
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error retrieving data from database');
    }
};

// Obtener citas de hoy en un rango de horas
exports.getCitasHoyRango = async (req, res) => {
    const { horaInicio, horaFin } = req.query;
    try {
        const result = await sql.query(`
            SELECT * FROM Citas_CruzRoja
            WHERE fecha = CAST(GETDATE() AS DATE)
            AND hora BETWEEN '${horaInicio}' AND '${horaFin}'
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error retrieving data from database');
    }
};

// Obtener una cantidad limitada de citas de hoy
exports.getCitasHoyLimite = async (req, res) => {
    const { limite } = req.query;
    try {
        const result = await sql.query(`
            SELECT TOP (${limite}) * FROM Citas_CruzRoja
            WHERE fecha = CAST(GETDATE() AS DATE)
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error retrieving data from database');
    }
};

// Obtener citas de hoy según el tipo de cita
exports.getCitasHoyTipo = async (req, res) => {
    const { tipo } = req.query;
    try {
        const result = await sql.query(`
            SELECT * FROM Citas_CruzRoja
            WHERE fecha = CAST(GETDATE() AS DATE)
            AND tipo_de_cita = '${tipo}'
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error retrieving data from database');
    }
};