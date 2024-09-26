// backend/models/fileModel.js
const db = require('../config/db');

// Función para insertar un archivo en la base de datos
const insertFile = (fileData) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO files (file_name, created_at) VALUES (?, ?)`;
        const values = [fileData.file_name, fileData.created_at];

        db.query(query, values, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.insertId); // Retorna el ID del archivo insertado
        });
    });
};

// Función para obtener todos los archivos de la base de datos
const getAllFiles = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM files ORDER BY created_at DESC`;

        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results); // Retorna todos los archivos
        });
    });
};

// Función para obtener un archivo por su ID
const getFileById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM files WHERE id = ?`;

        db.query(query, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]); // Retorna el archivo encontrado
        });
    });
};

module.exports = {
    insertFile,
    getAllFiles,
    getFileById,
};
