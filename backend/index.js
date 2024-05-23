import express, { json } from "express";
import { pool } from "./db.js"
import cors from "cors"

const app = express()

app.use(cors())
app.use(json())

app.listen(3000)


app.post('/registro' , async(req,res) => {

    const {nombre, apellido_uno, apellido_dos, correo, password, id_plan} = req.body

    const [result] = await pool.query('INSERT INTO usuarios (nombre, apellido_uno, apellido_dos, correo, password, id_plan, status)VALUES (?,?,?,?,?,?,0)' , [nombre, apellido_uno, apellido_dos, correo, password, id_plan])

    res.send({
        id: result.insertId
    })
})

app.get('/usuarios' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM usuarios')
    res.send(result)
})

app.get('/busqueda', async (req, res) => {
    const searchTerm = req.query.searchTerm;
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

    const searchParam = `%${searchTerm}%`;
    const peliculas = await pool.query(peliculasQuery, [searchParam, searchParam, searchParam, searchParam, searchParam, searchParam]);
    const series = await pool.query(seriesQuery, [searchParam, searchParam, searchParam, searchParam, searchParam, searchParam]);

    const results = [...peliculas[0], ...series[0]];

    const uniqueResults = Array.from(new Set(results.map(result => result.id)))
        .map(id => results.find(result => result.id === id));

    res.send(uniqueResults);
});




app.post('/perfil_peliculas', async (req, res) => {
    const { id_perfil, id_pelicula, terminada, guardado, minuto } = req.body;

    const [existing] = await pool.query('SELECT * FROM perfil_pelicula WHERE id_perfil = ? AND id_pelicula = ?', [id_perfil, id_pelicula]);

    if (existing.length > 0) {
        return res.status(400).send({ message: "La película ya está en la lista del usuario." });
    }

    const [result] = await pool.query('INSERT INTO perfil_pelicula (id_perfil, id_pelicula, terminada, guardado, minuto) VALUES (?, ?, ?, ?, ?)', [id_perfil, id_pelicula, terminada, guardado, minuto]);
    
    res.send({
        id: result.insertId,
        message: "Película agregada a la lista del usuario."
    });
});

app.post('/perfil_series', async (req, res) => {
    const { id_perfil, id_serie, id_capitulo, terminada, guardado, minuto } = req.body;

    const [existing] = await pool.query('SELECT * FROM perfil_serie WHERE id_perfil = ? AND id_serie = ?', [id_perfil, id_serie]);

    if (existing.length > 0) {
        return res.status(400).send({ message: "La serie ya está en la lista del usuario." });
    }

    const [result] = await pool.query('INSERT INTO perfil_serie (id_perfil, id_serie, id_capitulo, terminada, guardado, minuto) VALUES (?, ?, ?, ?, ?, ?)', [id_perfil, id_serie, id_capitulo, terminada, guardado, minuto]);
    
    res.send({
        id: result.insertId,
        message: "Serie agregada a la lista del usuario."
    });
});


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

app.get('/novedades' , async(req,res)=>{
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
    const [result] = await pool.query('SELECT perfiles.id, perfiles.nombre, perfiles.id_usuario, imagenes_perfil.url FROM perfiles JOIN imagenes_perfil ON imagenes_perfil.id = perfiles.id_imagen WHERE id = ?', [req.params.id])
})

app.get('/perfiles/usuario/:id', async(req,res)=>{
    const [result] = await pool.query('SELECT perfiles.id, perfiles.nombre, perfiles.id_usuario, imagenes_perfil.url FROM perfiles JOIN imagenes_perfil ON imagenes_perfil.id = perfiles.id_imagen WHERE id_usuario = ?', [req.params.id])
    res.send(result)
})

app.get('/perfiles/usuario/:id/cantidad', async(req,res)=>{
    const [result] = await pool.query('SELECT usuarios.correo, usuarios.id_plan, COUNT(perfiles.id) AS cantidad_perfiles, planes.num_pantalla AS "maximo_perfiles" FROM usuarios JOIN perfiles ON usuarios.id = perfiles.id_usuario JOIN planes ON planes.id = usuarios.id_plan WHERE usuarios.id = ?', [req.params.id])

    res.send(result)
})

app.delete('/perfiles/:id', async(req,res)=>{

    const [result] = await pool.query('DELETE FROM perfiles WHERE perfiles.id = ?;', [req.params.id])

    res.send(result)
})

app.put('/perfiles/:id', async(req,res)=>{

    const {nombre, id_imagen} = req.body

    const result = await pool.query('UPDATE perfiles SET nombre = ?, id_imagen = ? WHERE perfiles.id = ?', [nombre, id_imagen, req.params.id])

    res.send(result)

})

app.post('/perfiles/', async(req,res)=>{
    const { nombre, id_usuario, id_imagen} = req.body

    const [result] = await pool.query('INSERT INTO perfiles (`id`, `nombre`, `id_usuario`, `id_imagen`) VALUES (NULL, ?, ?, ?);', [nombre, id_usuario, id_imagen])
    res.send(result)
})

app.get('/imagenes/perfil', async(req, res)=>{
    const result = await pool.query('SELECT * FROM imagenes_perfil')

    res.send(result)
})