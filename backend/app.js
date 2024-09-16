const express = require('express');
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');
const archiver = require('archiver');

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

function getNextFileNumber(basePath, baseFileName) {
    const files = fs.readdirSync(basePath);
    const excelFiles = files.filter(file => file.startsWith(baseFileName) && file.endsWith('.xlsx'));

    let maxNumber = 0;
    excelFiles.forEach(file => {
        const match = file.match(new RegExp(`(${baseFileName})(\\d+)\\.xlsx$`));
        if (match) {
            const number = parseInt(match[2], 10);
            if (number > maxNumber) {
                maxNumber = number;
            }
        }
    });

    return maxNumber + 1;
}

function generateExcelFiles(basePath, fileCount, rowsPerFile, fileNameBase, changingValueBase) {
    const fixedValues = [2, 179944634, 'JF', 5350031710, 1, 1, 507, 'jfgonzalezbofill@gmail.com'];
    const csvFilePath = path.join(basePath, 'files.csv');
    const filePaths = [];

    let globalCounter = 1;
    let fileNumber = getNextFileNumber(basePath, fileNameBase);

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    for (let i = 0; i < fileCount; i++) {
        const wsData = [];

        for (let j = 0; j < rowsPerFile; j++) {
            const changingValue = `${changingValueBase}${globalCounter}`;
            const rowData = [...fixedValues, changingValue];
            wsData.push(rowData);

            globalCounter++;
        }

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Datos');

        const fileName = `${fileNameBase}${fileNumber}.xlsx`;
        const filePath = path.join(basePath, fileName);

        XLSX.writeFile(wb, filePath);
        filePaths.push(filePath);

        console.log(`...El archivo ${fileName} ha sido creado exitosamente en ${basePath}`);

        fileNumber++;
    }

    // Escribir las rutas en el archivo CSV
    fs.writeFileSync(csvFilePath, filePaths.join('\n'), 'utf8');
    console.log(`...El archivo CSV ha sido creado exitosamente en ${csvFilePath}`);
}

function zipFiles(basePath, zipPath) {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', function() {
        console.log(`...El archivo ZIP ha sido creado exitosamente en ${zipPath}`);
    });

    archive.pipe(output);

    const files = fs.readdirSync(basePath).filter(file => file.endsWith('.xlsx'));
    files.forEach(file => {
        archive.file(path.join(basePath, file), { name: file });
    });

    archive.finalize();
}

app.post('/generate', (req, res) => {
    const { fileCount, rowsPerFile, fileNameBase, changingValueBase } = req.body;

    const basePath = path.join('C:/archivos');
    generateExcelFiles(basePath, fileCount, rowsPerFile, fileNameBase, changingValueBase);

    res.json({ success: true });
});

app.post('/download-zip', (req, res) => {
    const basePath = path.join('C:/archivos');
    const zipPath = path.join(basePath, 'files.zip');

    zipFiles(basePath, zipPath);

    res.download(zipPath, 'files.zip', (err) => {
        if (err) {
            console.error('Error al descargar el archivo ZIP:', err);
            res.status(500).send('Error al descargar el archivo ZIP.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
