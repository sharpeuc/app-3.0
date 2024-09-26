const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'hector', 
    password: '123', 
    database: 'mi_app_db' 
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = db;






