import { Router } from "express";
import { ListPeliculas , SelectPeliculasById , SelectPeliculasByGenero , SelectPeliculasByActor , SelectPeliculasByDirector , SelectPeliculasRecomendadas , SelectPeliculasNovedades , PostPeliculas} from "../controllers/peliculas.controllers.js"

const router = Router ()

router.get('/peliculas' , ListPeliculas)

router.get('/peliculas/:id' , SelectPeliculasById)

router.get('/peliculas/genero/:id', SelectPeliculasByGenero)

router.get('/peliculas/actor/:id' , SelectPeliculasByActor)

router.get('/peliculas/director/:id' , SelectPeliculasByDirector)

router.get('/recomendados' , SelectPeliculasRecomendadas)

router.get('/novedades' , SelectPeliculasNovedades)

router.get('/peliculas' , PostPeliculas)

export default router