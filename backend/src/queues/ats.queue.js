const { Queue } = require("bullmq");

const atsQueue = new Queue("atsQueue", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

module.exports = atsQueue;