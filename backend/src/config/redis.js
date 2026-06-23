const { Redis } = require("ioredis");

console.log("REDIS_URL Exists:", !!process.env.REDIS_URL);
console.log("REDIS_HOST:", process.env.REDIS_HOST);

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST || "redis",
      port: process.env.REDIS_PORT || 6379,
    });

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

module.exports = redis;