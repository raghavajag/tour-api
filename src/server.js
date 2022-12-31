require('dotenv').config()
const app = require('./app');
const connectDB = require('./config/db');
const Logger = require('./utils/Logger');

async function bootServer(port) {
    try {
        Logger.info(`Starting server in ${process.env.MODE} mode`);
        Logger.info(`Connecting to database ${process.env.DB_NAME}...`);
        await connectDB();
        Logger.success("Connected to database");

    } catch (error) {
        Logger.error("Failed to boot server");
        Logger.error(error);
        return process.exit(1);
    }
    return app.listen(PORT, () => {
        Logger.success(`API server listening on port ${port}`);
    })
}
const PORT = parseInt(process.env.PORT ?? "5005", 10);
bootServer(PORT);