let express = require('express');
const addApiRoutes = require('./routes/index');
function buildApp() {
    const app = express();
    app.use(express.json())

    // Sanitize data

    // Set security headesrs

    // Prevent XSS attacks

    // Rate Limiting

    addApiRoutes(app);
    return app;
}
module.exports = buildApp();