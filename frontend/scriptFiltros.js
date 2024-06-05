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
        const response = await fetch(`http://localhost:3000/filtros?genero=${encodeURIComponent(generos.join(','))}`);
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

    const alternatedResults = [];
    const peliculasArray = Array.from(uniquePeliculas.values());
    const seriesArray = Array.from(uniqueSeries.values());

    for (let i = 0; i < Math.max(peliculasArray.length, seriesArray.length); i++) {
        if (peliculasArray[i]) alternatedResults.push(peliculasArray[i]);
        if (seriesArray[i]) alternatedResults.push(seriesArray[i]);
    }

    alternatedResults.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        const img = document.createElement('img');
        img.src = item.imagen;
        img.alt = `Imagen de ${item.nombre}`;

        gridItem.appendChild(img);
        resultsDiv.appendChild(gridItem);
    });
}

loadAllContent();


