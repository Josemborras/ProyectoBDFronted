const form = document.querySelector('form')
const nombre = document.querySelector('#nombre')
const apellidos = document.querySelector('#apellidos')


// PETICIÓN POST PARA GUARDAR DATOS EN EL SERVIDOR
const guardarUsuario = (url, datos) => {

    console.log(datos)

    fetch(url, {
        method : 'POST',
        headers :{
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(datos)

    })
    .then( res => {
        if(res.ok){
            return res.json()
        }else{
            throw new Error('error en la petiición')
        }
    })
    .then(json => console.log('Empleado registrado'))
}

form.addEventListener('submit' , (e) =>{
    e.preventDefault()

    const url = "http://localhost:3000/registro"

    const nombre = document.querySelector('#nombre').value
    const apellido_uno = document.querySelector('#apellido_uno').value
    const apellido_dos = document.querySelector('#apellido_dos').value
    const correo = document.querySelector('#correo').value
    const password = document.querySelector('#password').value
    const apodo = document.querySelector('#apodo').value
    const url_foto = document.querySelector('#url_foto').value
    const id_plan = document.querySelector('#id_plan').value
    

    console.log(nombre)
    const datos = {
        nombre : nombre,
        apellido_uno : apellido_uno,
        apellido_dos : apellido_dos,
        correo : correo,
        password : password,
        apodo : apodo,
        url_foto : url_foto,
        id_plan : id_plan
    }


    guardarUsuario(url, datos)


})