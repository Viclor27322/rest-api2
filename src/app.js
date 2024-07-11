import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.routes";
import usersRoutes from "./routes/users.routes";
import emailRoutes from "./routes/email.routes";
import preguntasRoutes from "./routes/preguntas.routes";
import citasRoutes from "./routes/citas.routes";
import pacientesRoutes from "./routes/pacientes.routes";
import notasRoutes from "./routes/notas.routes";
import horariosRoutes from "./routes/horarios.routes";
import morgan from "morgan";

import config from "./config";

const app = express();

// settings
app.set("port", config.port);



// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Manejo de la ruta raíz
app.get("/", (req, res) => {
    res.send("¡Hola, este es mi servidor API!");
  });
  
  app.get("/api", (req, res) => {
    res.send("¡APIw!");
  });
  
  app.get("/users", (req, res) => {
    res.send("Obteniendo información del usuario!");
  });
// Routes
app.use("/api", productRoutes);
app.use("/api", usersRoutes);
app.use("/api", emailRoutes);
app.use("/api", preguntasRoutes);
app.use("/api", citasRoutes);
app.use("/api", pacientesRoutes);
app.use("/api", notasRoutes);
app.use("/api", horariosRoutes);
// Endpoint para obtener todas las citas de hoy
app.get('/citas/hoy', async (req, res) => {
  try {
      const result = await sql.query(`
          SELECT * FROM Citas
          WHERE fecha = CAST(GETDATE() AS DATE)
      `);
      res.json(result.recordset);
  } catch (err) {
      res.status(500).send('Error retrieving data from database');
  }
});

// Endpoint para obtener citas de hoy en un rango de horas
app.get('/citas/hoy/rango', async (req, res) => {
  const { horaInicio, horaFin } = req.query;
  try {
      const result = await sql.query(`
          SELECT * FROM Citas
          WHERE fecha = CAST(GETDATE() AS DATE)
          AND hora BETWEEN '${horaInicio}' AND '${horaFin}'
      `);
      res.json(result.recordset);
  } catch (err) {
      res.status(500).send('Error retrieving data from database');
  }
});

// Endpoint para obtener una cantidad limitada de citas de hoy
app.get('/citas/hoy/limite', async (req, res) => {
  const { limite } = req.query;
  try {
      const result = await sql.query(`
          SELECT TOP (${limite}) * FROM Citas
          WHERE fecha = CAST(GETDATE() AS DATE)
      `);
      res.json(result.recordset);
  } catch (err) {
      res.status(500).send('Error retrieving data from database');
  }
});

// Endpoint para obtener citas de hoy según el tipo de cita
app.get('/citas/hoy/tipo', async (req, res) => {
  const { tipo } = req.query;
  try {
      const result = await sql.query(`
          SELECT * FROM Citas
          WHERE fecha = CAST(GETDATE() AS DATE)
          AND tipo_de_cita = '${tipo}'
      `);
      res.json(result.recordset);
  } catch (err) {
      res.status(500).send('Error retrieving data from database');
  }
});

export { app };
