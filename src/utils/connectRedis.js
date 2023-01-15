const redis = require('redis');
const Logger = require('./Logger');

const redis_client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || "redis"}:${process.env.REDIS_PORT}`
});
redis_client.connect().then(() => {
    Logger.success("Redis client Connected");
})
module.exports = redis_client;