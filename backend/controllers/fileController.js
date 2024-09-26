// backend/controllers/fileController.js
const fs = require('fs');
const XLSX = require('xlsx');
const archiver = require('archiver');
const path = require('path');
const mysql = require('mysql'); // Importa MySQL
const db = require('../config/db');
const PDFDocument = require('pdfkit'); // Asegúrate de tener esto

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

function generateExcelFiles(req, res) {
    const { fileCount, rowsPerFile, fileNameBase, changingValueBase } = req.body;

    const basePath = path.join('C:/archivos');
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

        // Inserta el nombre del archivo en la base de datos
        db.query('INSERT INTO archivos (nombre_archivo) VALUES (?)', [fileName], (error) => {
            if (error) {
                console.error('Error al insertar en la base de datos:', error);
            }
        });

        fileNumber++;
    }

    fs.writeFileSync(csvFilePath, filePaths.join('\n'), 'utf8');
    console.log(`...El archivo CSV ha sido creado exitosamente en ${csvFilePath}`);

    res.json({ success: true });
}

function downloadZip(req, res) {
    const basePath = path.join('C:/archivos');
    const zipFileName = 'files.zip';

    res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', {
        zlib: { level: 9 } // Mayor nivel de compresión
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(res);

    fs.readdirSync(basePath).forEach(file => {
        if (file.endsWith('.xlsx')) {
            const filePath = path.join(basePath, file);
            archive.file(filePath, { name: file });
        }
    });

    archive.finalize();
}

// Agrega esta función para manejar el historial de archivos
function getHistorialArchivos(req, res) {
    db.query('SELECT * FROM archivos', (error, resultados) => {
        if (error) {
            console.error('Error al obtener archivos:', error);
            return res.status(500).send('Error al obtener archivos');
        }

        const doc = new PDFDocument();
        let filename = 'historial_archivos.pdf';
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(25).text('Historial de Archivos Generados', { align: 'center' });
        doc.moveDown();

        resultados.forEach(archivo => {
            doc.fontSize(12).text(`ID: ${archivo.id}, Nombre: ${archivo.nombre_archivo}, Fecha: ${archivo.fecha_generacion}`);
            doc.moveDown();
        });

        doc.end();
    });
}

module.exports = { generateExcelFiles, downloadZip, getHistorialArchivos };

