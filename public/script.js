document.getElementById('generate-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fileCount = document.getElementById('fileCount').value;
    const rowsPerFile = document.getElementById('rowsPerFile').value;
    const fileNameBase = document.getElementById('fileNameBase').value;
    const changingValueBase = document.getElementById('changingValueBase').value;

    const response = await fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileCount, rowsPerFile, fileNameBase, changingValueBase }),
    });

    const data = await response.json();
    const output = document.getElementById('output');
    if (data.success) {
        output.textContent = `¡Archivos generados exitosamente! Revisa la carpeta de destino.`;
    } else {
        output.textContent = 'Hubo un error al generar los archivos.';
    }
});
