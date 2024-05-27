import { pool } from "../db.js"

export const SelectUsuarios = async(req,res) => {
    const [result] = await pool.query('SELECT * FROM usuarios')
    res.send(result)
}

export const SelectPerfilesByUsuario = async(req,res)=>{
    const [result] = await pool.query('SELECT perfiles.id, perfiles.nombre, perfiles.id_usuario, imagenes_perfil.url FROM perfiles JOIN imagenes_perfil ON imagenes_perfil.id = perfiles.id_imagen WHERE id_usuario = ?', [req.params.id])
    res.send(result)
}

export const SelectPerfilById = async(req,res)=>{
    const [result] = await pool.query('SELECT perfiles.id, perfiles.nombre, perfiles.id_usuario, imagenes_perfil.url FROM perfiles JOIN imagenes_perfil ON imagenes_perfil.id = perfiles.id_imagen WHERE id = ?', [req.params.id])

    res.send(result)
}

export const SelectNumeroPerfiles = async(req,res)=>{
    const [result] = await pool.query('SELECT usuarios.correo, usuarios.id_plan, COUNT(perfiles.id) AS cantidad_perfiles, planes.num_pantalla AS "maximo_perfiles" FROM usuarios JOIN perfiles ON usuarios.id = perfiles.id_usuario JOIN planes ON planes.id = usuarios.id_plan WHERE usuarios.id = ?', [req.params.id])

    res.send(result)
}

export const SelectPlanes = async(req,res)=>{
    const [result] = await pool.query('SELECT * FROM planes')
    res.send(result)
}

export const SelectImagenesPerfil= async(req, res)=>{
    const [result] = await pool.query('SELECT * FROM imagenes_perfil')

    res.send(result)
}

export const RegistroUsuario = async(req,res) => {

    const {nombre, apellido_uno, apellido_dos, correo, password, id_plan} = req.body

    const [result] = await pool.query('INSERT INTO usuarios (nombre, apellido_uno, apellido_dos, correo, password, id_plan, status)VALUES (?,?,?,?,?,?,0)' , [nombre, apellido_uno, apellido_dos, correo, password, id_plan])

    res.send({
        id: result.insertId
    })
}

export const CrearPerfil = async(req,res)=>{
    const { nombre, id_usuario, id_imagen} = req.body

    const [result] = await pool.query('INSERT INTO perfiles (`id`, `nombre`, `id_usuario`, `id_imagen`) VALUES (NULL, ?, ?, ?);', [nombre, id_usuario, id_imagen])
    res.send(result)
}

export const DeletePerfil = async(req,res)=>{

    const [result] = await pool.query('DELETE FROM perfiles WHERE perfiles.id = ?;', [req.params.id])

    res.send(result)
}

export const EditPerfil = async(req,res)=>{

    const {nombre, id_imagen} = req.body

    const result = await pool.query('UPDATE perfiles SET nombre = ?, id_imagen = ? WHERE perfiles.id = ?', [nombre, id_imagen, req.params.id])

    res.send(result)

}







