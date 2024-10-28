import { app } from "./app.js";
import config from "./config.js"

const PORT = config.port;

// app.listen(app.get("port"));

// console.log("Server on port", app.get("port"));

app.listen(PORT, ()=> {
    console.log(`Servidor en el puerto ${PORT}`);
})