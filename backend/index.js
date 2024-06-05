import cors from "cors";
import express from "express";
import busquedaRoute from './routes/busqueda.js';
import favRoute from './routes/favoritos.js';
import listaSeriesRoute from './routes/listaSeries.js';
import listaPeliculasRoute from './routes/listaPeliculas.js';
import usuarioRoute from './routes/usuario.js';
import imagenPoSRoute from './routes/imagenPoS.js';

const app = express()

app.use(cors())
app.use(express.json())
app.use(busquedaRoute)
app.use(favRoute)
app.use(listaSeriesRoute)
app.use(listaPeliculasRoute)
app.use(usuarioRoute)
app.use(imagenPoSRoute)

app.listen(3000)



