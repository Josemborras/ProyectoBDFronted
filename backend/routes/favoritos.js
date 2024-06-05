import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router()

router.get('/favoritos/:id_perfil', async (req, res) => {
    const { id_perfil } = req.params;

    try {
        const [peliculas] = await pool.query('SELECT series.*, imagenes_serie.url_foto FROM perfil_serie JOIN series ON series.id = perfil_serie.id_multi JOIN perfiles ON perfil_serie.id_perfil = perfiles.id JOIN imagenes_serie ON imagenes_serie.id_serie = series.id WHERE perfiles.id = 3 GROUP BY series.id', [id_perfil]);
        const [series] = await pool.query('SELECT peliculas.*, imagenes_pelicula.url_foto FROM perfil_pelicula JOIN peliculas ON peliculas.id = perfil_pelicula.id_multi JOIN perfiles ON perfil_pelicula.id_perfil = perfiles.id JOIN imagenes_pelicula ON imagenes_pelicula.id_pelicula = peliculas.id WHERE perfiles.id = ?', [id_perfil]);

        res.send({ peliculas, series });
    } catch (error) {
        console.error('Error al obtener los ítems favoritos:', error);
        res.status(500).send({ message: 'Error al obtener los ítems favoritos' });
    }
});

router.post('/perfil_peliculas', async (req, res) => {
    const { id_perfil, id_multi, guardado } = req.body;

    const [existing] = await pool.query('SELECT * FROM perfil_pelicula WHERE id_perfil = ? AND id_multi = ?', [id_perfil, id_multi]);
    try {
        const [existing] = await pool.query('SELECT * FROM perfil_pelicula WHERE id_perfil = ? AND id_multi = ?', [id_perfil, id_multi]);

        if (existing.length > 0) {
            return res.status(400).send({ message: "La película ya está en la lista del usuario." });
        }

        const [result] = await pool.query('INSERT INTO perfil_pelicula (id_perfil, id_multi, guardado) VALUES (?, ?, ?)', [id_perfil, id_multi, guardado]);

        res.send({
            id: result.insertId,
            message: "Película agregada a la lista del usuario."
        });
    } catch (error) {
        console.error("Error al agregar la película a la lista del usuario:", error);
        res.status(500).send({ message: "Error al agregar la película a la lista del usuario." });
    }
});



router.post('/perfil_series', async (req, res) => {
    const { id_perfil, id_multi, id_capitulo, guardado } = req.body;

    const [existing] = await pool.query('SELECT * FROM perfil_serie WHERE id_perfil = ? AND id_multi = ?', [id_perfil, id_multi]);

    if (existing.length > 0) {
        return res.status(400).send({ message: "La serie ya está en la lista del usuario." });
    }

    const [result] = await pool.query('INSERT INTO perfil_serie (id_perfil, id_multi, id_capitulo, guardado) VALUES (?, ?, ?, ?)', [id_perfil, id_multi, id_capitulo, guardado]);
    
    res.send({
        id: result.insertId,
        message: "Serie agregada a la lista del usuario."
    });
});


export default router