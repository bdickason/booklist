// Config.js - Configuration of random stuffs

exports.SESSION_SECRET = process.env.SESSION_SECRET

// Goodreads
exports.GOODREADS_KEY = process.env.GOODREADS_KEY;
exports.GOODREADS_SECRET = process.env.GOODREADS_SECRET;

// Redis
exports.REDIS_HOSTNAME = process.env.REDIS_HOSTNAME;
exports.REDIS_PORT = process.env.REDIS_PORT;
exports.REDIS_CACHE_TIME = process.env.REDIS_CACHE_TIME;    // Time to cache objects (in seconds)

// Mongo