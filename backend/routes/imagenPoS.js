import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

router.get('/imagen', async (req, res) => {
    const id = req.query.id;
    const tipo = req.query.tipo;

    let query = '';

    console.log("hola")
    console.log(tipo)

    if (tipo === 'pelicula') {
        query = `
            SELECT url_foto AS imagen
            FROM imagenes_pelicula
            WHERE id_pelicula = ?
        `;
    } else if (tipo === 'serie') {
        query = `
            SELECT url_foto AS imagen
            FROM imagenes_series
            WHERE id_serie = ?
        `;
    } else {
        return res.status(400).send({ message: "Tipo no válido" });
    }

    try {
        const [results] = await pool.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).send({ message: "No encontrado" });
        }

        res.send(results[0]);
    } catch (error) {
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});

export default router;

