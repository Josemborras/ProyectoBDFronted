document.addEventListener('DOMContentLoaded', () => {
    loadAllContent();
    document.querySelectorAll('input[name="genero"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterContent);
    });
    document.getElementById('searchTerm').addEventListener('input', filterContent);
});

async function loadAllContent() {
    try {
        const response = await fetch('http://localhost:3000/filtros');
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        console.log('Datos cargados:', data); // Debug
        displayResults(data);
    } catch (error) {
        console.error('Error en loadAllContent:', error);
    }
}

async function filterContent() {
    const searchTerm = document.getElementById('searchTerm').value;
    const checkboxes = document.querySelectorAll('input[name="genero"]:checked');
    const generos = Array.from(checkboxes).map(cb => cb.value);

    try {
        const response = await fetch(`http://localhost:3000/filtros?genero=${generos.join(',')}&search=${searchTerm}`);
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        console.log('Datos filtrados:', data); // Debug
        displayResults(data);
    } catch (error) {
        console.error('Error en filterContent:', error);
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const { peliculas, series } = data;
    const alternatedResults = [];

    for (let i = 0; i < Math.max(peliculas.length, series.length); i++) {
        if (peliculas[i]) alternatedResults.push(peliculas[i]);
        if (series[i]) alternatedResults.push(series[i]);
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
