const redis = require('redis');

const redis_client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || "redis"}:${process.env.REDIS_PORT}`
});
redis_client.connect().then(() => {
})
module.exports = redis_client;