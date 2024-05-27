import express, { json } from "express";
import cors from "cors"
import routerPelis from "./routes/peliculas.routes.js"
import routerUsuario from "./routes/usuario.routes.js";

const app = express()

app.use(cors())
app.use(json())
app.use(routerPelis)
app.use(routerUsuario)

app.listen(3000)



