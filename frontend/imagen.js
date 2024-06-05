async function obtenerImagen(id, tipo) {
    try {
        const response = await fetch(`http://localhost:3000/imagen?id=${id}&tipo=${tipo}`);
        if (!response.ok) {
            throw new Error('Error al obtener la imagen');
        }
        const data = await response.json();
        return data.imagen;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

const id = 1;
const tipo = 'pelicula';

obtenerImagen(id, tipo).then(imagen => {
    if (imagen) {
        console.log('URL de la imagen:', imagen);
    } else {
        console.log('No se encontró la imagen');
    }
});
