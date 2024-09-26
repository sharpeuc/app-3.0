// backend/server.js
const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use('/api', apiRoutes); // Usar las rutas de la API


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

