require("dotenv").config();
const amqp = require("amqplib");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");

// MongoDB model
const TranslationProject = require("./models/TranslationProject");

// HTTP + Socket.IO setup
const app = require("express")();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // User joins their personal room (authenticated userId must be sent on connect)
  socket.on("join", (userId) => {
    console.log(`Socket ${socket.id} joined room: ${userId}`);
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const RESULT_QUEUE = "translation_results";

async function startResultConsumer() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(RESULT_QUEUE, { durable: true });

  console.log("🦊 Waiting for translation results...");

  channel.consume(
    RESULT_QUEUE,
    async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());

          // Destructure expected data from message
          const { jobId, userId, title, domain, results } = data;

          // Save to MongoDB
          const fullSentences = results.map(({ input, translated }) => ({
            source: input,
            translated,
            manuallyEdited: false,
          }));

          const project = new TranslationProject({
            userId,
            title,
            domain,
            sentences: fullSentences,
          });

          await project.save();

          console.log(`✅ Saved project for user ${userId}, job ${jobId}`);

          // Emit event to user's socket room
          io.to(userId).emit("translation-completed", {
            jobId,
            projectId: project._id,
            message: "Translation completed",
            project,
          });

          channel.ack(msg);
        } catch (err) {
          console.error("❌ Error processing translation result:", err);
          channel.nack(msg, false, false); // discard bad message
        }
      }
    },
    { noAck: false }
  );
}

async function start() {
  // Connect to MongoDB first
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  server.listen(4000, () => {
    console.log("🚀 Server & Socket.IO running on port 4000");
  });

  await startResultConsumer();
}

start().catch(console.error);
