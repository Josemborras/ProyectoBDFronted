document.addEventListener('DOMContentLoaded', () => {
    getImagesNovedades();
    getNovedadesPeliculas();
    getNovedadesSeries();
    getNovedadesEstrenos();
    getNovedades();
    setupSearchInput();
});

async function getImagesNovedades() {
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

async function getNovedadesPeliculas() {
    try {
        const response = await fetch('http://localhost:3000/novedades');
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        const divImagePeliculas = document.getElementById('divImagePeliculas');

        data.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';

            const img = document.createElement('img');
            img.src = item.imagen;
            img.alt = "Imagen de película";

            gridItem.appendChild(img);
            divImagePeliculas.appendChild(gridItem);
        });
    } catch (error) {
        console.error('Error en getNovedadesPeliculas:', error);
    }
}

async function getNovedadesSeries() {
    try {
        const response = await fetch('http://localhost:3000/novedades/series');
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
        console.error('Error en getNovedadesSeries:', error);
    }
}

async function getNovedades() {
    try {
        const response = await fetch('http://localhost:3000/novedadesImagen');
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        const divImageNovedades = document.getElementById('divImageNovedades');

        data.forEach(pelicula => {
            const peliculaContainer = document.createElement('div');
            const img = document.createElement('img');
            const title = document.createElement('h3');

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
            divImageNovedades.appendChild(peliculaContainer);
        });
    } catch (error) {
        console.error('Error en getNovedades:', error);
    }
}

async function getNovedadesEstrenos() {
    try {
        const response = await fetch('http://localhost:3000/estrenos');
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        const divImageEstrenos = document.getElementById('divImageEstrenos');

        data.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';

            const img = document.createElement('img');
            img.src = item.imagen;
            img.alt = "Imagen de estreno";

            gridItem.appendChild(img);
            divImageEstrenos.appendChild(gridItem);
        });
    } catch (error) {
        console.error('Error en getNovedadesEstrenos:', error);
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


async function agregarAFavoritos(id, tipo) {
    const id_perfil = 3;
    const terminada = false;
    const guardado = true;
    const minuto = 0;

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
            id,
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