import express, { json } from "express";
import { pool } from "./db.js"
import cors from "cors"

const app = express()

app.use(cors())
app.use(json())

app.listen(3000)


app.post('/registro', async(req,res) =>{

    const { nombre , apellido_uno, apellido_dos, correo, password, apodo, url_foto, id_plan } = req.body

    const [result] = await pool.query('INSERT INTO usuarios (nombre, apellido_uno, apellido_dos, correo, password, apodo, url_foto, id_plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)' , [nombre, apellido_uno, apellido_dos, correo, password, apodo, url_foto, id_plan])
    
    res.send({
        id: result.insertId
    })
})

app.get('/registro' , async(req,res) => {
    const [result] = await pool.query('SELECT * FROM usuarios')
    res.send(result)
})