function buscarPeliculas() {
    const searchTerm = document.getElementById('searchTerm').value;
    
    fetch(`http://localhost:3000/busqueda?searchTerm=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = '';
            
            if (data.length === 0) {
                resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
            } else {
                const resultList = document.createElement('ul');
                data.forEach(pelicula => {
                    const listItem = document.createElement('li');
                    listItem.textContent = pelicula.nombre;
                    resultList.appendChild(listItem);
                });
                resultsContainer.appendChild(resultList);
            }
        })
        .catch(error => console.error('Error al buscar películas:', error));
}
