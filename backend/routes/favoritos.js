import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router()

router.post('/perfil_peliculas', async (req, res) => {
    const { id_perfil, id_pelicula, terminada, guardado, minuto } = req.body;

    const [existing] = await pool.query('SELECT * FROM perfil_pelicula WHERE id_perfil = ? AND id_pelicula = ?', [id_perfil, id_pelicula]);
    try {
        const [existing] = await pool.query('SELECT * FROM perfil_pelicula WHERE id_perfil = ? AND id_pelicula = ?', [id_perfil, id_pelicula]);

        if (existing.length > 0) {
            return res.status(400).send({ message: "La película ya está en la lista del usuario." });
        }

        const [result] = await pool.query('INSERT INTO perfil_pelicula (id_perfil, id_pelicula, terminada, guardado, minuto) VALUES (?, ?, ?, ?, ?)', [id_perfil, id_pelicula, terminada, guardado, minuto]);

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


export default router