const addPerfil = document.querySelector('#addPerfil')
const deletePerfil = document.querySelector('#deletePerfil')



addPerfil.addEventListener('submit' , (e) =>{
    e.preventDefault()

    const url = 'http://localhost:3000/perfiles'

    const nombre = document.querySelector('#nombre').value

    const id_usuario = document.querySelector('#id_usuario').value

    const id_imagen = document.querySelector('#id_imagen').value



    fetch('http://localhost:3000/perfiles/usuario/'+id_usuario+"/cantidad")
    .then(res => res.json())
    .then(data =>{

        const maximo = data[0].maximo_perfiles
        const cantidad = data[0].cantidad_perfiles

        let maxReached = false

        if(maximo<=cantidad){
            maxReached=true
        }

        if (maxReached) {
            console.log("Maximo de usuarios alcanzado")
        }else{
            const datos = {
                nombre : nombre,
                id_imagen : id_imagen,
                id_usuario : id_usuario
            }

            guardarPerfil(url, datos)
        }



    })





})


deletePerfil.addEventListener('submit' , (e)=>{
    e.preventDefault()

    const id = document.querySelector('#deleteId').value

    const url = 'http://localhost:3000/perfiles/' + id

    eliminarPerfil(url)
})


const guardarPerfil = (url, datos) => {

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
            throw new Error('error en la petición')
        }
    })
    .then(json => console.log('Perfil registrado'))
}

const eliminarPerfil = (url)=>{
    fetch(url, {
        method : 'DELETE',

    })
    .then( res=>{
        if(res.ok){
            return res.json()
        }else{
            throw new Error('error en la petición')
        }
    })
    .then(json => console.log('Perfil eliminado'))
}
