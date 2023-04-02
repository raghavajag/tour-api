const express = require('express');
const addApiRoutes = require('./routes/index');
const errorHandler = require('./middleware/error');
const cors = require('cors');

function buildApp() {
    const app = express();
    app.use(cors())
    app.use(express.json())
    // Sanitize data

    // Set security headesrs

    // Prevent XSS attacks

    // Rate Limiting

    addApiRoutes(app);
    app.use(errorHandler);
    return app;
}
module.exports = buildApp();