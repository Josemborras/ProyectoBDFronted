const perfilId = sessionStorage.getItem('perfilId')
const fotoPerfil = document.querySelector('.fotoPerfilUser')

fetch('http://localhost:3000/perfiles/' + perfilId)
    .then(res => res.json())
    .then(json =>{
        fotoPerfil.src = json[0].url
    })