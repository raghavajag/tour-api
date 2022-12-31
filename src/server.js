require('dotenv').config()
const app = require('./app');
const connectDB = require('./config/db');

async function bootServer(port) {
    try {
        console.log(`Starting server in ${process.env.MODE} mode`);
        console.log(`Connecting to databse ${process.env.DB_NAME}...`);
        await connectDB();
    } catch (error) {
        console.log(error);
        return process.exit(1);
    }
    return app.listen(PORT, () => {
        console.log(`API server listening on port ${port}`);
    })
}
const PORT = parseInt(process.env.PORT ?? "5005", 10);
bootServer(PORT);