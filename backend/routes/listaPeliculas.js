import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router()

router.get('/peliculas' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM peliculas')
    res.send(result)
})

router.get('/peliculas/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM peliculas where id = ?', [req.params.id])
    res.send(result)
})

router.get('/peliculas/genero/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.nombre, peliculas.duracion, peliculas.valoracion, peliculas.rango_edad, peliculas.descripcion FROM categorias JOIN categorias_peliculas ON categorias.id = categorias_peliculas.id_categoria JOIN peliculas ON categorias_peliculas.id_pelicula = peliculas.id WHERE categorias.id = ? ', [req.params.id])
    res.send(result)
})

router.get('/peliculas/actor/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.nombre, peliculas.duracion, peliculas.valoracion, peliculas.rango_edad, peliculas.descripcion FROM actores JOIN actores_peliculas ON actores.id = actores_peliculas.id_actor JOIN peliculas ON actores_peliculas.id_pelicula = peliculas.id WHERE actores.id = ? ', [req.params.id])
    res.send(result)
})

router.get('/peliculas/director/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.nombre, peliculas.duracion, peliculas.valoracion, peliculas.rango_edad, peliculas.descripcion FROM directores JOIN peliculas ON directores.id = peliculas.id_director WHERE directores.id=? ', [req.params.id])
    res.send(result)
})

router.get('/recomendados' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM peliculas WHERE valoracion >75 ORDER BY RAND()')
    res.send(result)
})

router.get('/novedades' , async(req,res)=>{
    const [result] = await pool.query('SELECT * FROM peliculas ORDER BY fecha DESC')
    res.send(result)
})

router.post('/peliculas', async(req,res)=>{
    const { nombre , duracion, valoracion, rango_edad, descripcion, fecha, url_vdeo, id_director } = req.body

    const [result] = await pool.query('INSERT INTO peliculas (nombre , duracion, valoracion, rango_edad, descripcion, fecha, url_vdeo, id_director ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)' , [nombre , duracion, valoracion, rango_edad, descripcion, fecha, url_vdeo, id_director ])

    res.send({
        id: result.insertId
    })
})

export default router