const connectRabbit = require("./rabbitClient");

async function publishTranslationJob(job) {
  const channel = await connectRabbit();
  const queue = "translation_jobs";

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(job)), {
    persistent: true,
  });

  console.log(`📨 Sent job ${job.jobId}`);
}

module.exports = publishTranslationJob;
