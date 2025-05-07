const mongoose = require("mongoose");

const SentenceSchema = new mongoose.Schema({
  source: { type: String, required: true },
  translation: { type: String, required: true },
  manuallyEdited: { type: Boolean, default: false },
});

const TranslationProjectSchema = new mongoose.Schema({
  userId: {
    // Reference to your custom userId
    type: String,
    required: true,
  },
  title: { type: String, required: true, trim: true },
  domain: {
    type: String,
    required: true,
    enum: ["legal", "medical", "technical", "finance", "ecommerce", "general"],
  },
  sentences: [SentenceSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TranslationProjectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("TranslationProject", TranslationProjectSchema);
