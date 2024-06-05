async function loadFavorites(type) {

    const id_perfil = sessionStorage.getItem('perfilId'); 
    let url;
    if (type === 'peliculas' || type === 'all') {
        url = `http://localhost:3000/perfil_peliculas/${id_perfil}`;
        const response = await fetch(url);
        const peliculas = await response.json();
        displayFavorites(peliculas, 'pelicula');
    }
    if (type === 'series' || type === 'all') {
        url = `http://localhost:3000/perfil_series/${id_perfil}`;
        const response = await fetch(url);
        const series = await response.json();
        displayFavorites(series, 'serie');
    }
}

function displayFavorites(items, type) {
    const container = document.getElementById('favorites-container');
    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = type;
        div.innerHTML = `
            <p>${type === 'pelicula' ? 'Película' : 'Serie'}: ${item.nombre || item.id_serie}</p>
        `;
        container.appendChild(div);
    });
}

loadFavorites('all');
