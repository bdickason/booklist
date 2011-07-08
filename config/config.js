// Config.js - Configuration of random stuffs

exports.SESSION_SECRET = process.env.SESSION_SECRET || "internets";

// Goodreads
exports.GOODREADS_KEY = process.env.GOODREADS_KEY || "";
exports.GOODREADS_SECRET = process.env.GOODREADS_SECRET || "";

// Redis
exports.REDIS_HOSTNAME = process.env.REDIS_HOSTNAME || "localhost";
exports.REDIS_PORT = process.env.REDIS_PORT || "6379";
exports.REDIS_CACHE_TIME = process.env.REDIS_CACHE_TIME || "90";    // Time to cache objects (in seconds)

// Mongo