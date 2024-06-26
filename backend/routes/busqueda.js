import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router()

router.get('/busqueda', async (req, res) => {
    const searchTerm = req.query.searchTerm;
    const searchParam = `%${searchTerm}%`;

    const peliculasQuery = `
    SELECT p.id, p.nombre, i.url_foto AS imagen, 'pelicula' AS tipo
    FROM peliculas p
    LEFT JOIN directores d ON p.id_director = d.id
    LEFT JOIN actores_peliculas ap ON p.id = ap.id_pelicula
    LEFT JOIN actores a ON ap.id_actor = a.id
    LEFT JOIN categorias_peliculas cp ON p.id = cp.id_pelicula
    LEFT JOIN categorias c ON cp.id_categoria = c.id
    LEFT JOIN imagenes_pelicula i ON i.id_pelicula = p.id
    WHERE p.nombre LIKE ?
    OR d.nombre LIKE ?
    OR a.nombre LIKE ?
    OR c.genero LIKE ?
    OR CONCAT(d.nombre, ' ', d.apellido_uno) LIKE ?
    OR CONCAT(a.nombre, ' ', a.apellido_uno) LIKE ?
    GROUP BY p.id
`;

    const seriesQuery = `
    SELECT s.id, s.nombre, i.url_foto AS imagen, 'serie' AS tipo
    FROM series s
    LEFT JOIN serie_director sd ON s.id = sd.id_serie
    LEFT JOIN directores d ON sd.id_director = d.id
    LEFT JOIN actores_series ap ON s.id = ap.id_serie
    LEFT JOIN actores a ON ap.id_actor = a.id
    LEFT JOIN categorias_series cp ON s.id = cp.id_serie
    LEFT JOIN imagenes_serie i ON i.id_serie = s.id
    LEFT JOIN categorias c ON cp.id_categoria = c.id
    WHERE s.nombre LIKE ?
    OR d.nombre LIKE ?
    OR a.nombre LIKE ?
    OR c.genero LIKE ?
    OR CONCAT(d.nombre, ' ', d.apellido_uno) LIKE ?
    OR CONCAT(a.nombre, ' ', a.apellido_uno) LIKE ?
    GROUP BY s.id
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

router.get('/carrusel', async (req, res) => {
    const tipo = req.query.tipo;
    
    if (tipo === 'mejorValoradas') {
        try {
            const query = `
            SELECT ip.url_foto, p.descripcion, p.nombre
            FROM imagenes_pelicula ip
            INNER JOIN peliculas p ON ip.id_pelicula = p.id
            ORDER BY p.valoracion DESC;
            `;
            
            const [results] = await pool.query(query);
    
            if (results.length === 0) {
                return res.status(404).send({ message: "No encontrado" });
            }
    
            res.send(results);
        } catch (error) {
            res.status(500).send({ message: "Error en la búsqueda" });
        }
    } else {
        return res.status(400).send({ message: "Tipo no válido" });
    }
});

export default router