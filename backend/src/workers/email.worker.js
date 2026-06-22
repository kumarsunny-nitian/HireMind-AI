const { Worker } = require("bullmq");

const { sendEmail } = require("../services/email.service");

new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, html } = job.data;

    await sendEmail(to, subject, html);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "redis",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  }
);