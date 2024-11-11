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
import cruzRoutes from "./routes/cruzroja.routes";
import heridasRoutes from "./routes/heridas.routes"
import paysRoutes from "./routes/pays.routes";
import morgan from "morgan";

import config from "./config";

const app = express();

// settings
app.set("port", config.port);



// Middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'https://cirupied-eight.vercel.app'
];

app.use(cors({
  origin: '*', // Permitir todos los orígenes temporalmente
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
app.use("/api", cruzRoutes);
app.use("/api", heridasRoutes);
app.use("/api", paysRoutes);

export { app };
