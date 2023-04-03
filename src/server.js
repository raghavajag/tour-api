require('dotenv').config()
const app = require('./app');
const connectDB = require('./config/db');

async function bootServer(port) {
    try {
        await connectDB();
        return app.listen(port, () => {
            console.log("Server started on port " + port);
        })
    } catch (error) {
        console.log(error);
        return process.exit(1);
    }

}
const PORT = parseInt(process.env.PORT ?? "5005", 10);
bootServer(PORT);