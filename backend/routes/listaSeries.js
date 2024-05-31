import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router()

router.get('/series' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM series')
    res.send(result)
})

router.get('/series/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM series where id = ?', [req.params.id])
    res.send(result)
})

router.get('/series/genero/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT series.nombre, series.rango_edad, series.num_temporadas, series.valoracion, series.descripcion  FROM categorias JOIN categorias_series ON categorias.id = categorias_series.id_categoria JOIN series ON categorias_series.id_serie = series.id WHERE categorias.id = ? ', [req.params.id])
    res.send(result)
})

router.get('/series/actor/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT series.nombre, series.rango_edad, series.num_temporadas, series.valoracion, series.descripcion FROM actores JOIN actores_series ON actores.id = actores_series.id_actor JOIN series ON actores_series.id_serie = series.id WHERE actores.id = ? ', [req.params.id])
    res.send(result)
})

router.get('/series/director/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT series.nombre, series.rango_edad, series.num_temporadas, series.valoracion, series.descripcion FROM directores JOIN serie_director ON directores.id = serie_director.id_director JOIN series ON serie_director.id_serie = series.id WHERE directores.id=? ', [req.params.id])
    res.send(result)
})

router.get('/imagenes/carrusel', async(req, res)=>{
    const [result] = await pool.query('SELECT series.*, imagenes_serie.url_foto FROM series JOIN imagenes_serie ON imagenes_serie.id_serie=series.id WHERE imagenes_serie.nombre LIKE "%banner%";')

    res.send(result)
})

export default router