document.getElementById('search-input').addEventListener('input', buscar);

async function buscar() {
    const searchTerm = document.getElementById('search-input').value;
    const resultsContainer = document.getElementById('results-container');
    const resultsDiv = document.getElementById('results-list');

    if (searchTerm.length === 0) {
        resultsContainer.style.display = 'none';
        resultsDiv.innerHTML = '';
        return;
    }

    const response = await fetch(`http://localhost:3000/busqueda?searchTerm=${searchTerm}`);
    const data = await response.json();
    resultsDiv.innerHTML = '';

    if (data.length > 0) {
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.style.display = 'none';
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