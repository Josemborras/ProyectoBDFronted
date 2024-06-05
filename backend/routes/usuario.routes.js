import { Router } from "express"
import { SelectUsuarios, SelectPerfilesByUsuario , SelectPerfilById , SelectNumeroPerfiles , SelectPlanes , SelectImagenesPerfil , RegistroUsuario , CrearPerfil, DeletePerfil , EditPerfil, SelectUsuarioById} from "../controllers/usuario.controller.js"

const router = Router ()

router.get('/usuarios' , SelectUsuarios)

router.get('/usuarios/:id' , SelectUsuarioById)

router.get('/perfiles/usuario/:id' , SelectPerfilesByUsuario)

router.get('/perfiles/:id' , SelectPerfilById)

router.get('/perfiles/usuario/:id/cantidad' , SelectNumeroPerfiles)

router.get('/planes' , SelectPlanes)

router.get('/imagenes/perfil' , SelectImagenesPerfil)

router.post('/registro' , RegistroUsuario)

router.post('/perfiles/' , CrearPerfil)

router.delete('/perfiles/:id', DeletePerfil)

router.put('/perfiles/:id', EditPerfil)

export default router 