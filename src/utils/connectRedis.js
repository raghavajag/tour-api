const redis = require('redis');
const Logger = require('./Logger');

const redis_client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
redis_client.connect().then(() => {
    Logger.success("Redis client Connected");
})
module.exports = redis_client;