// Maneja la generación de archivos XLSX
document.getElementById('generateButton').addEventListener('click', () => {
    const fileCount = document.getElementById('fileCount').value;
    const rowsPerFile = document.getElementById('rowsPerFile').value;
    const fileNameBase = document.getElementById('fileNameBase').value;
    const changingValueBase = document.getElementById('changingValueBase').value;

    fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileCount, rowsPerFile, fileNameBase, changingValueBase }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Archivos generados exitosamente.');
    })
    .catch(error => console.error('Error al generar archivos:', error));
});

// Maneja la descarga del archivo ZIP
document.getElementById('zipButton').addEventListener('click', () => {
    window.location.href = '/api/download-zip';
});

// Maneja la descarga del historial de archivos en PDF
document.getElementById('historialArchivosBtn').addEventListener('click', (event) => {
    event.preventDefault(); // Evita que el enlace navegue a otra página
    window.location.href = '/api/files/historial-archivos'; // Redirige a la ruta que genera el PDF
});

// Función para mostrar la sección de ayuda
document.getElementById('ayudaBtn').addEventListener('click', () => {
    window.location.href = '/ayuda.html'; // Redirige a la página de ayuda
});


