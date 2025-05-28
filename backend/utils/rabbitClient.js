const amqp = require("amqplib");

let channel = null;

async function connectRabbit() {
  if (channel) return channel;

  const connection = await amqp.connect("amqp://localhost"); // or use docker host
  channel = await connection.createChannel();
  return channel;
}

module.exports = connectRabbit;
