document.addEventListener('DOMContentLoaded', () => {
    loadAllContent();
    document.querySelectorAll('input[name="genero"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterContent);
    });
});

async function loadAllContent() {
    try {
        const response = await fetch('http://localhost:3000/filtros');
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        console.log('Datos cargados:', data);
        displayResults(data);
    } catch (error) {
        console.error('Error en loadAllContent:', error);
    }
}

async function filterContent() {
    const checkboxes = document.querySelectorAll('input[name="genero"]:checked');
    const generos = Array.from(checkboxes).map(cb => cb.value);

    try {
        const response = await fetch("http://localhost:3000/filtros?genero=${encodeURIComponent(generos.join(','))})");
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        console.log('Datos filtrados:', data);
        displayResults(data);
    } catch (error) {
        console.error('Error en filterContent:', error);
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const { peliculas, series } = data;

    const uniquePeliculas = new Map();
    const uniqueSeries = new Map();

    peliculas.forEach(pelicula => {
        if (!uniquePeliculas.has(pelicula.id)) {
            uniquePeliculas.set(pelicula.id, pelicula);
        }
    });

    series.forEach(serie => {
        if (!uniqueSeries.has(serie.id)) {
            uniqueSeries.set(serie.id, serie);
        }
    });

    const peliculasArray = Array.from(uniquePeliculas.values());
    const seriesArray = Array.from(uniqueSeries.values());

    const peliculasDiv = document.createElement('div');
    peliculasDiv.className = 'peliculas-section';
    const peliculasTitle = document.createElement('h2');
    peliculasTitle.textContent = 'PELÍCULAS';
    peliculasDiv.appendChild(peliculasTitle);

    const peliculasGrid = document.createElement('div');
    peliculasGrid.className = 'grid';
    peliculasArray.forEach(pelicula => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        const img = document.createElement('img');
        img.src = pelicula.imagen;
        img.alt = "Imagen de ${pelicula.nombre}";

        gridItem.appendChild(img);
        peliculasGrid.appendChild(gridItem);
    });
    peliculasDiv.appendChild(peliculasGrid);

    const seriesDiv = document.createElement('div');
    seriesDiv.className = 'series-section';
    const seriesTitle = document.createElement('h2');
    seriesTitle.textContent = 'SERIES';
    seriesDiv.appendChild(seriesTitle);

    const seriesGrid = document.createElement('div');
    seriesGrid.className = 'grid';
    seriesArray.forEach(serie => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        const img = document.createElement('img');
        img.src = serie.imagen;
        img.alt = "Imagen de ${serie.nombre}";

        gridItem.appendChild(img);
        seriesGrid.appendChild(gridItem);
    });
    seriesDiv.appendChild(seriesGrid);

    resultsDiv.appendChild(peliculasDiv);
    resultsDiv.appendChild(seriesDiv);
}

loadAllContent();


