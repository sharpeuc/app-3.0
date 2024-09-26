const express = require('express');
const fileRoutes = require('./routes/api'); // Actualiza para asegurarte de que use api.js
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Usar las rutas de API para archivos
app.use('/api/files', fileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

