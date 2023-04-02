const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(
            process.env.MONGO_URI
                ? process.env.MONGO_URI
                :
                `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP || "mongo"}:${process.env.MONGO_PORT || 27017}/?authSource=admin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
        return process.exit(1);
    }
};

module.exports = connectDB;