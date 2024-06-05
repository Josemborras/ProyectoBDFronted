import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

router.get('/imagen', async (req, res) => {
    const id = req.query.id;
    const tipo = req.query.tipo;

    let query = '';

    if (tipo === 'pelicula') {
        query = `
            SELECT url_foto AS imagen
            FROM imagenes_pelicula
            WHERE id_pelicula = ?
        `;
    } else if (tipo === 'serie') {
        query = `
            SELECT url_foto AS imagen
            FROM imagenes_serie
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


router.get('/imagenes_pelicula', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT url_foto AS imagen FROM imagenes_pelicula');
        res.send(results);
    } catch (error) {
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});

router.get('/imagenes_serie', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT url_foto AS imagen FROM imagenes_serie');
        res.send(results);
    } catch (error) {
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});

router.get('/recomendaciones', async (req, res) => {
    try {
        const [peliculas] = await pool.query('SELECT * FROM peliculas WHERE valoracion > 75 ORDER BY RAND()');


        const peliculasConImagenes = await Promise.all(peliculas.map(async (pelicula) => {
            const [imagenes] = await pool.query('SELECT url_foto AS imagen FROM imagenes_pelicula WHERE id_pelicula = ?', [pelicula.id]);
            console.log('Imágenes para película ID', pelicula.id, ':', imagenes);
            const peliculaConImagen = {
                ...pelicula,
                imagen: imagenes.length > 0 ? imagenes[0].imagen : 'http://127.0.0.1:5501/frontend/Proyecto_LenguajeMarcas/img/Inicio/Logo%20(1).png'
            };
            console.log('Película con imagen:', peliculaConImagen);
            return peliculaConImagen;
        }));

        res.send(peliculasConImagenes);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});

router.get('/filtros', async (req, res) => {
    const genero = req.query.genero || '';
    const searchTerm = req.query.search || '';
    try {
        const [peliculas] = await pool.query(`
            SELECT p.id, p.nombre, ip.url_foto AS imagen, p.genero 
            FROM peliculas p 
            JOIN imagenes_pelicula ip ON p.id = ip.id_pelicula 
            WHERE p.genero LIKE ? AND p.nombre LIKE ?
        `, [`%${genero}%`, `%${searchTerm}%`]);

        const [series] = await pool.query(`
            SELECT s.id, s.nombre, iser.url_foto AS imagen, s.genero 
            FROM series s 
            JOIN imagenes_serie iser ON s.id = iser.id_serie 
            WHERE s.genero LIKE ? AND s.nombre LIKE ?
        `, [`%${genero}%`, `%${searchTerm}%`]);

        res.json({ peliculas, series });
    } catch (error) {
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});


export default router;

