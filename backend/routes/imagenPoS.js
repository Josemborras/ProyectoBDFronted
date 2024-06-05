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
        const [peliculas] = await pool.query('SELECT * FROM peliculas ORDER BY valoracion DESC');

        const peliculasConImagenes = await Promise.all(peliculas.map(async (pelicula) => {
            const [imagenes] = await pool.query('SELECT url_foto AS imagen FROM imagenes_pelicula WHERE id_pelicula = ?', [pelicula.id]);
            const peliculaConImagen = {
                ...pelicula,
                imagen: imagenes.length > 0 ? imagenes[0].imagen : 'http://127.0.0.1:5501/frontend/Proyecto_LenguajeMarcas/img/Inicio/Logo%20(1).png'
            };
            return peliculaConImagen;
        }));

        res.send(peliculasConImagenes);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});

router.get('/estrenos', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT url_foto AS imagen FROM estrenos');
        res.send(results);
    } catch (error) {
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});

router.get('/filtros', async (req, res) => {
    const generos = req.query.genero ? req.query.genero.split(',') : [];

    let generoQuery = '';
    let generoValues = [];
    if (generos.length > 0) {
        generoQuery = ' AND c.genero IN (?)';
        generoValues = [generos];
    }

    try {
        const [peliculas] = await pool.query(`
            SELECT DISTINCT p.id, p.nombre, ip.url_foto AS imagen
            FROM peliculas p
            JOIN imagenes_pelicula ip ON p.id = ip.id_pelicula
            JOIN categorias_peliculas cp ON p.id = cp.id_pelicula
            JOIN categorias c ON cp.id_categoria = c.id
            WHERE 1=1${generoQuery}
        `, generoValues);

        const [series] = await pool.query(`
            SELECT DISTINCT s.id, s.nombre, iser.url_foto AS imagen
            FROM series s
            JOIN imagenes_serie iser ON s.id = iser.id_serie
            JOIN categorias_series cs ON s.id = cs.id_serie
            JOIN categorias c ON cs.id_categoria = c.id
            WHERE 1=1${generoQuery}
        `, generoValues);

        res.json({ peliculas, series });
    } catch (error) {
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});


router.get('/novedadesImagen', async (req, res) => {
    try {
        const [peliculas] = await pool.query('SELECT * FROM peliculas ORDER BY fecha DESC');

        const peliculasConImagenes = await Promise.all(peliculas.map(async (pelicula) => {
            const [imagenes] = await pool.query('SELECT url_foto AS imagen FROM imagenes_pelicula WHERE id_pelicula = ?', [pelicula.id]);
            const peliculaConImagen = {
                ...pelicula,
                imagen: imagenes.length > 0 ? imagenes[0].imagen : 'http://127.0.0.1:5501/frontend/Proyecto_LenguajeMarcas/img/Inicio/Logo%20(1).png'
            };
            return peliculaConImagen;
        }));

        res.send(peliculasConImagenes);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});

router.get('/novedadesImagenSeries', async (req, res) => {
    try {
        const [series] = await pool.query('SELECT * FROM series ORDER BY fecha DESC');

        const seriesConImagenes = await Promise.all(series.map(async (serie) => {
            const [imagenes] = await pool.query('SELECT url_foto AS imagen FROM imagenes_serie WHERE id_serie = ?', [serie.id]);
            const serieConImagen = {
                ...serie,
                imagen: imagenes.length > 0 ? imagenes[0].imagen : 'http://127.0.0.1:5501/frontend/Proyecto_LenguajeMarcas/img/Inicio/Logo%20(1).png'
            };
            return serieConImagen;
        }));

        res.send(seriesConImagenes);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send({ message: "Error en la búsqueda" });
    }
});


router.get('/carruselNovedades', async (req, res) => {
    const tipo = req.query.tipo;
    
    if (tipo === 'novedades') {
        try {
            const query = `
            SELECT ip.url_foto, p.descripcion, p.nombre
            FROM imagenes_pelicula ip
            INNER JOIN peliculas p ON ip.id_pelicula = p.id
            ORDER BY p.fecha DESC;
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


export default router;

