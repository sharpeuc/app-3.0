// backend/routes/api.js
const express = require('express');
const router = express.Router();
const { generateExcelFiles, downloadZip } = require('../controllers/fileController');
const db = require('../config/db'); // Asegúrate de importar la configuración de la base de datos
const PDFDocument = require('pdfkit');

router.post('/generate', generateExcelFiles);
router.get('/download-zip', downloadZip);
router.get('/historial-archivos', (req, res) => {
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
});

module.exports = router;

