import { pool } from "../config/db.js"

export const ListPeliculas = async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.*, imagenes_pelicula.url_foto AS imagen FROM peliculas JOIN imagenes_pelicula ON imagenes_pelicula.id_pelicula = peliculas.id')
    res.send(result)
}

export const SelectPeliculasById = async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.*, imagenes_pelicula.url_foto AS imagen FROM peliculas JOIN imagenes_pelicula ON imagenes_pelicula.id_pelicula = peliculas.id where peliculas.id = ?', [req.params.id])
    res.send(result)
}

export const SelectPeliculasByGenero = async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.* , imagenes_pelicula.url_foto AS imagen FROM categorias JOIN categorias_peliculas ON categorias.id = categorias_peliculas.id_categoria JOIN peliculas ON categorias_peliculas.id_pelicula = peliculas.id JOIN imagenes_pelicula ON imagenes_pelicula.id_pelicula = peliculas.id WHERE categorias.id = ?', [req.params.id])
    res.send(result)
}

export const SelectPeliculasByActor = async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.* , imagenes_pelicula.url_foto AS imagen FROM actores JOIN actores_peliculas ON actores.id = actores_peliculas.id_actor JOIN peliculas ON actores_peliculas.id_pelicula = peliculas.id JOIN imagenes_pelicula ON imagenes_pelicula.id_pelicula = peliculas.id WHERE actores.id = ?', [req.params.id])
    res.send(result)
}

export const SelectPeliculasByDirector = async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.* , imagenes_pelicula.url_foto AS imagen FROM directores JOIN peliculas ON directores.id = peliculas.id_director JOIN imagenes_pelicula ON imagenes_pelicula.id_pelicula = peliculas.id WHERE directores.id=? ', [req.params.id])
    res.send(result)
}

export const SelectPeliculasRecomendadas = async(req,res) => {
    const [result] = await pool.query('SELECT peliculas.*, imagenes_pelicula.url_foto AS imagen FROM peliculas JOIN imagenes_pelicula ON imagenes_pelicula.id_pelicula = peliculas.id WHERE valoracion >75 ORDER BY RAND()')
    res.send(result)
}

export const SelectPeliculasNovedades = async(req,res)=>{
    const [result] = await pool.query('SELECT peliculas.*, imagenes_pelicula.url_foto AS imagen FROM peliculas JOIN imagenes_pelicula ON imagenes_pelicula.id_pelicula = peliculas.id ORDER BY fecha DESC')
    res.send(result)
}

export const PostPeliculas = async(req,res)=>{
    const { nombre , duracion, valoracion, rango_edad, descripcion, fecha, url_vdeo, id_director } = req.body

    const [result] = await pool.query('INSERT INTO peliculas (nombre , duracion, valoracion, rango_edad, descripcion, fecha, url_vdeo, id_director ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)' , [nombre , duracion, valoracion, rango_edad, descripcion, fecha, url_vdeo, id_director ])

    res.send({
        id: result.insertId
    })
}