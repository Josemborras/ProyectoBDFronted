
import cors from "cors";
import express, { json } from "express";
import busquedaRoute from './routes/busqueda.js';
import favRoute from './routes/favoritos.js';
import listaSeriesRoute from './routes/listaSeries.js';
import listaPeliculasRoute from './routes/peliculas.routes.js';
import usuarioRoute from './routes/usuario.routes.js';
import imagenPoSRoute from './routes/imagenPoS.js';

const app = express()

app.use(cors())
app.use(json())

app.use(busquedaRoute)
app.use(favRoute)
app.use(listaSeriesRoute)
app.use(listaPeliculasRoute)
app.use(usuarioRoute)
app.use(imagenPoSRoute)

app.listen(3000)
