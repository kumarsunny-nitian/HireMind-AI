const { Queue } =
 require("bullmq");

const { Queue } = require("bullmq");

const atsQueue = new Queue("atsQueue", {
  connection: {
    host: process.env.REDIS_HOST || "redis",
    port: 6379,
  },
});

module.exports = atsQueue;