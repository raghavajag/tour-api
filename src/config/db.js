const mongoose = require('mongoose');
const Logger = require('../utils/Logger').default;

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        Logger.error(error.message);
        Logger.error(
            "Failed to connect to database. Exiting with exit status code 1."
        );
        process.exit(1);
    }
};

module.exports = connectDB;