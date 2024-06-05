async function loadFavorites() {
    const id_perfil = sessionStorage.getItem('perfilId'); 
    const url = `http://localhost:3000/favoritos/${id_perfil}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la solicitud');
        
        const { peliculas, series } = await response.json();
        
        displayFavorites(peliculas, 'pelicula');
        displayFavorites(series, 'serie');
    } catch (error) {
        console.error('Error al cargar los favoritos:', error);
    }
}

function displayFavorites(items, type) {
    const container = document.getElementById('favorites-container');
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = type;
        div.innerHTML = `
            <p>${type === 'pelicula' ? 'Película' : 'Serie'}: ${item.nombre || item.id_multi}</p>
        `;
        container.appendChild(div);
    });
}


