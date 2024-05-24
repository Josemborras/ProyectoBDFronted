import express, { json } from "express";
import { pool } from "./db.js"
import cors from "cors"

const app = express()

app.use(cors())
app.use(json())

app.listen(3000)

app.get('/busqueda', async (req, res) => {
    const searchTerm = req.query.searchTerm;
    const searchParam = `%${searchTerm}%`;

    const peliculasQuery = `
        SELECT p.id, p.nombre, 'pelicula' AS tipo
        FROM peliculas p
        LEFT JOIN directores d ON p.id_director = d.id
        LEFT JOIN actores_peliculas ap ON p.id = ap.id_pelicula
        LEFT JOIN actores a ON ap.id_actor = a.id
        LEFT JOIN categorias_peliculas cp ON p.id = cp.id_pelicula
        LEFT JOIN categorias c ON cp.id_categoria = c.id
        WHERE p.nombre LIKE ?
        OR d.nombre LIKE ?
        OR a.nombre LIKE ?
        OR c.genero LIKE ?
        OR CONCAT(d.nombre, ' ', d.apellido_uno) LIKE ?
        OR CONCAT(a.nombre, ' ', a.apellido_uno) LIKE ?
    `;

    const seriesQuery = `
        SELECT s.id, s.nombre, 'serie' AS tipo
        FROM series s
        LEFT JOIN serie_director sd ON s.id = sd.id_serie
        LEFT JOIN directores d ON sd.id_director = d.id
        LEFT JOIN actores_series ap ON s.id = ap.id_serie
        LEFT JOIN actores a ON ap.id_actor = a.id
        LEFT JOIN categorias_series cp ON s.id = cp.id_serie
        LEFT JOIN categorias c ON cp.id_categoria = c.id
        WHERE s.nombre LIKE ?
        OR d.nombre LIKE ?
        OR a.nombre LIKE ?
        OR c.genero LIKE ?
        OR CONCAT(d.nombre, ' ', d.apellido_uno) LIKE ?
        OR CONCAT(a.nombre, ' ', a.apellido_uno) LIKE ?
    `;

    try {
        const [peliculas] = await pool.query(peliculasQuery, [searchParam, searchParam, searchParam, searchParam, searchParam, searchParam]);
        const [series] = await pool.query(seriesQuery, [searchParam, searchParam, searchParam, searchParam, searchParam, searchParam]);

        const results = [...peliculas, ...series];

        const uniqueResults = Array.from(new Set(results.map(result => result.id)))
            .map(id => results.find(result => result.id === id));

        res.send(uniqueResults);
    } catch (error) {
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});

app.get('/series' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM series')
    res.send(result)
})

app.get('/series/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM series where id = ?', [req.params.id])
    res.send(result)
})

app.get('/series/genero/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT series.nombre, series.rango_edad, series.num_temporadas, series.valoracion, series.descripcion  FROM categorias JOIN categorias_series ON categorias.id = categorias_series.id_categoria JOIN series ON categorias_series.id_serie = series.id WHERE categorias.id = ? ', [req.params.id])
    res.send(result)
})

app.get('/series/actor/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT series.nombre, series.rango_edad, series.num_temporadas, series.valoracion, series.descripcion FROM actores JOIN actores_series ON actores.id = actores_series.id_actor JOIN series ON actores_series.id_serie = series.id WHERE actores.id = ? ', [req.params.id])
    res.send(result)
})

app.get('/series/director/:id' , async(req,res) => {
    const [result] = await pool.query('SELECT series.nombre, series.rango_edad, series.num_temporadas, series.valoracion, series.descripcion FROM directores JOIN serie_director ON directores.id = serie_director.id_director JOIN series ON serie_director.id_serie = series.id WHERE directores.id=? ', [req.params.id])
    res.send(result)
})

app.get('/imagenes/carrusel', async(req, res)=>{
    const [result] = await pool.query('SELECT series.*, imagenes_serie.url_foto FROM series JOIN imagenes_serie ON imagenes_serie.id_serie=series.id WHERE imagenes_serie.nombre LIKE "%banner%";')

    res.send(result)
})