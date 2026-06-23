const { Queue } = require("bullmq");

const connection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      host: process.env.REDIS_HOST || "redis",
      port: Number(process.env.REDIS_PORT) || 6379,
    };

const emailQueue = new Queue("emailQueue", {
  connection,
});

module.exports = emailQueue;