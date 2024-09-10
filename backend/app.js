const express = require('express');
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');

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

    fs.writeFileSync(csvFilePath, filePaths.join('\n'), 'utf8');
    console.log(`...El archivo CSV ha sido creado exitosamente en ${csvFilePath}`);
}

app.post('/generate', (req, res) => {
    const { fileCount, rowsPerFile, fileNameBase, changingValueBase } = req.body;

    const basePath = path.join('C:/archivos');
    generateExcelFiles(basePath, fileCount, rowsPerFile, fileNameBase, changingValueBase);

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
