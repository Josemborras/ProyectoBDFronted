document.addEventListener('DOMContentLoaded', () => {
    getImages();
    getPeliculas();
    getSeries();
    getRecomendados(); 
    setupSearchInput();
});

async function getImages() {
    try {
        const response = await fetch('http://localhost:3000/imagenes/carrusel');
        const data = await response.json();
        const carouselInner = document.getElementById('carousel-inner');
        
        data.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'carousel-item';
            if (index === 0) div.classList.add('active');

            const img = document.createElement('img');
            img.src = item.url_foto;
            img.className = 'd-block w-100';
            
            const caption = document.createElement('div');
            caption.className = 'carousel-caption';
            
            const title = document.createElement('h3');
            title.innerText = item.nombre;
            
            const description = document.createElement('p');
            description.innerText = item.descripcion; 

            const moreInfoButton = document.createElement('button');
            moreInfoButton.className = 'btn btn-warning';
            moreInfoButton.innerText = 'Más información';

            const watchNowButton = document.createElement('button');
            watchNowButton.className = 'btn btn-success';
            watchNowButton.innerText = 'Ver ahora';

            caption.appendChild(title);
            caption.appendChild(description);
            caption.appendChild(moreInfoButton);
            caption.appendChild(watchNowButton);

            div.appendChild(img);
            div.appendChild(caption);
            
            carouselInner.appendChild(div);
        });
    } catch (error) {
        console.error('Error en getImages:', error);
    }
}

async function getPeliculas() {
    try {
        const response = await fetch('http://localhost:3000/peliculas');
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        const divImagePeliculas = document.getElementById('divImagePeliculas');
            console.log(data)
        data.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.addEventListener('click', () => showInfo('pelicula', item.id));

            const img = document.createElement('img');
            img.src = item.imagen;
            img.alt = "Imagen de película";

            gridItem.appendChild(img);
            divImagePeliculas.appendChild(gridItem);
        });
    } catch (error) {
        console.error('Error en getPeliculas:', error);
    }
}

async function getSeries() {
    try {
        const response = await fetch('http://localhost:3000/series');
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        const divImageSeries = document.getElementById('divImageSeries');

        data.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.addEventListener('click', () => showInfo('serie', item.id));

            const img = document.createElement('img');
            img.src = item.imagen;
            img.alt = "Imagen de serie";

            gridItem.appendChild(img);
            divImageSeries.appendChild(gridItem);
        });
    } catch (error) {
        console.error('Error en getSeries:', error);
    }
}

async function getRecomendados() {
    try {
        const response = await fetch('http://localhost:3000/recomendados');
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        const divImageRecomendaciones = document.getElementById('divImageRecomendaciones');

        data.forEach(pelicula => {

            const peliculaContainer = document.createElement('div');
            const img = document.createElement('img');
            const title = document.createElement('h3');
            peliculaContainer.addEventListener('click', () => showInfo('pelicula', pelicula.id));

            img.src = pelicula.imagen;
            img.style.maxHeight = '200px';
            img.style.borderRadius = '5px';
            img.style.marginRight = '10px';
            img.style.transition = 'transform 0.3s';
            img.style.cursor = 'pointer';

            img.addEventListener('mouseover', () => {
                img.style.transform = 'scale(1.1)';
            });

            img.addEventListener('mouseout', () => {
                img.style.transform = 'scale(1)';
            });

            title.style.color = 'white';
            title.style.textDecoration = 'none';
            title.style.fontFamily = "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif";

            peliculaContainer.appendChild(img);
            divImageRecomendaciones.appendChild(peliculaContainer);
        });
    } catch (error) {
        console.error('Error en getRecomendados:', error);
    }
}

async function showInfo(type, id) {
    let url = type === 'pelicula' ? `http://localhost:3000/peliculas/${id}` : `http://localhost:3000/series/${id}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener la información');

        const data = await response.json();
        document.getElementById('infoModalLabel').innerText = data[0].nombre;
        document.getElementById('modal-description').innerText = data[0].descripcion;

        document.getElementById('modal-image').src = data[0].imagen;

        const playButton = document.getElementById('play-button');
        
        playButton.onclick = () => viajarReproduccion(data[0].url_video)

        const favoriteButton = document.getElementById('favorite-button');
        favoriteButton.onclick = () => agregarAFavoritos(data[0].id, type);


        new bootstrap.Modal(document.getElementById('infoModal')).show();
    } catch (error) {
        console.error('Error en showInfo:', error);
    }
}

async function getPaginaSeries() {
    try {
        const response = await fetch('http://localhost:3000/series');
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        const divImageSeries = document.getElementById('divImageSeries');

        data.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';

            const img = document.createElement('img');
            img.src = item.imagen;
            img.alt = "Imagen de serie";

            gridItem.appendChild(img);
            divImageSeries.appendChild(gridItem);
        });
    } catch (error) {
        console.error('Error en getSeries:', error);
    }
}

function setupSearchInput() {
    document.getElementById('search-input').addEventListener('input', buscar);
}

async function buscar() {
    const searchTerm = document.getElementById('search-input').value;
    const resultsContainer = document.getElementById('results-container');
    const resultsDiv = document.getElementById('results-list');

    if (searchTerm.length === 0) {
        resultsContainer.classList.add('hide');
        setTimeout(() => {
            resultsContainer.style.display = 'none';
        }, 500);
        resultsDiv.innerHTML = '';
        return;
    }

    const response = await fetch(`http://localhost:3000/busqueda?searchTerm=${searchTerm}`);
    const data = await response.json();
    resultsDiv.innerHTML = '';

    if (data.length > 0) {
        resultsContainer.classList.remove('hide');
        resultsContainer.style.display = 'block';
        setTimeout(() => {
            resultsContainer.classList.add('show');
        }, 10);
    } else {
        resultsContainer.classList.add('hide');
        setTimeout(() => {
            resultsContainer.style.display = 'none';
        }, 500);
    }

    data.forEach((item, index) => {
        if (index < 5) { 
            const itemDiv = document.createElement('div');
            itemDiv.className = 'result-item';
            itemDiv.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <h3>${item.nombre}</h3>
            `;
            resultsDiv.appendChild(itemDiv);
        }
    });
}


async function agregarAFavoritos(id_multi, tipo) {
    const id_perfil = sessionStorage.getItem('perfilId');
    const guardado = true;
   
    let url;
    if (tipo === 'pelicula') {
        url = 'http://localhost:3000/perfil_peliculas';
    } else if (tipo === 'serie') {
        url = 'http://localhost:3000/perfil_series';
    } else {
        console.error('Tipo desconocido:', tipo);
        return;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_perfil,
            id_multi,
            guardado
        })
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
    } else {
        alert('Error: ' + result.message);
    }
}

async function agregarAFavoritosPelicula(id_pelicula) {
    const id_perfil = 3;
    const terminada = false;
    const guardado = true;
    const minuto = 0;

    const response = await fetch('http://localhost:3000/perfil_peliculas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_perfil,
            id_pelicula,
            terminada,
            guardado,
            minuto
        })
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
    } else {
        alert('Error: ' + result.message);
    }
}

async function agregarAFavoritosSerie(id_serie, id_capitulo) {
    const id_perfil = 3;
    const terminada = false;
    const guardado = true;
    const minuto = 0;

    const response = await fetch('http://localhost:3000/perfil_series', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_perfil,
            id_serie,
            id_capitulo,
            terminada,
            guardado,
            minuto
        })
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
    } else {
        alert('Error: ' + result.message);
    }
}

function viajarReproduccion(url){
    sessionStorage.setItem('urlContenido', url)
    window.location.href = './reproduccion.html'
}



