import express, { json } from "express";
import { pool } from "./db.js"
import cors from "cors"

const app = express()

app.use(cors())
app.use(json())

app.listen(3000)


app.post('/registro' , async(req,res) => {

    const [result] = await pool.query('INSERT INTO usuarios (nombre, apellido_uno, apellido_dos, correo, password, id_plan, status)VALUES (?,?,?,?,?,?,0)' , [nombre, apellido_uno, apellido_dos, correo, password, id_plan])

    res.send({
        id: result.insertId
    })
})

app.get('/usuarios' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM usuarios')
    res.send(result)
})

app.get('/peliculas' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM peliculas')
    res.send(result)
})

app.get('/peliculas/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM peliculas where id = ?', [req.params.id])
    res.send(result)
})

app.get('/series' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM series')
    res.send(result)
})

app.get('/series/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM series where id = ?', [req.params.id])
    res.send(result)
})

app.get('/peliculas/genero/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.nombre, peliculas.duracion, peliculas.valoracion, peliculas.rango_edad, peliculas.descripcion FROM categorias JOIN categorias_peliculas ON categorias.id = categorias_peliculas.id_categoria JOIN peliculas ON categorias_peliculas.id_pelicula = peliculas.id WHERE categorias.id = ? ', [req.params.id])
    res.send(result)
})

app.get('/series/genero/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT series.nombre, series.rango_edad, series.num_temporadas, series.valoracion, series.descripcion  FROM categorias JOIN categorias_series ON categorias.id = categorias_series.id_categoria JOIN series ON categorias_series.id_serie = series.id WHERE categorias.id = ? ', [req.params.id])
    res.send(result)
})

app.get('/peliculas/actor/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.nombre, peliculas.duracion, peliculas.valoracion, peliculas.rango_edad, peliculas.descripcion FROM actores JOIN actores_peliculas ON actores.id = actores_peliculas.id_actor JOIN peliculas ON actores_peliculas.id_pelicula = peliculas.id WHERE actores.id = ? ', [req.params.id])
    res.send(result)
})

app.get('/series/actor/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT series.nombre, series.rango_edad, series.num_temporadas, series.valoracion, series.descripcion FROM actores JOIN actores_series ON actores.id = actores_series.id_actor JOIN series ON actores_series.id_serie = series.id WHERE actores.id = ? ', [req.params.id])
    res.send(result)
})

app.get('/peliculas/director/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.nombre, peliculas.duracion, peliculas.valoracion, peliculas.rango_edad, peliculas.descripcion FROM directores JOIN peliculas ON directores.id = peliculas.id_director WHERE directores.id=? ', [req.params.id])
    res.send(result)
})

app.get('/series/director/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT series.nombre, series.rango_edad, series.num_temporadas, series.valoracion, series.descripcion FROM directores JOIN serie_director ON directores.id = serie_director.id_director JOIN series ON serie_director.id_serie = series.id WHERE directores.id=? ', [req.params.id])
    res.send(result)
})

app.get('/recomendados' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM peliculas WHERE valoracion >75 ORDER BY RAND()')
    res.send(result)
})

app.get('/pelicula/novedades' , async(req,res)=>{
    const [result] = await pool.query('SELECT * FROM peliculas ORDER BY fecha DESC')
    res.send(result)
})

app.get('/planes' , async(req,res)=>{
    const [result] = await pool.query('SELECT * FROM planes')
    res.send(result)
})

app.post('/peliculas', async(req,res)=>{
    const { nombre , duracion, valoracion, rango_edad, descripcion, fecha, url_vdeo, id_director } = req.body

    const [result] = await pool.query('INSERT INTO peliculas (nombre , duracion, valoracion, rango_edad, descripcion, fecha, url_vdeo, id_director ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)' , [nombre , duracion, valoracion, rango_edad, descripcion, fecha, url_vdeo, id_director ])

    res.send({
        id: result.insertId
    })
})

app.get('/perfiles/:id', async(req,res)=>{
    const [result] = await pool.query('SELECT * FROM perfiles WHERE id_usuario = ?', [req.params.id])
    res.send(result)
})

app.delete('/perfiles/:id', async(req,res)=>{

    const [result] = await pool.query('DELETE FROM perfiles WHERE perfiles.id = ?;', [req.params.id])

    res.send(result)
})

app.post('/perfiles/:id', async(req,res)=>{
    const { nombre, id_usuario, id_imagen} = req.body

    const [result] = await pool.query('INSERT INTO perfiles (`id`, `nombre`, `id_usuario`, `id_imagen`) VALUES (NULL, ?, ?, ?);', [nombre, id_usuario, id_imagen])
    res.send(result)
})