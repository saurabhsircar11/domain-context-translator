const express = require("express");
const router = express.Router();
const axios = require("axios");
const TranslationProject = require("../models/TranslationProject");
const isAuthenticated = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");
const publishTranslationJob = require("../utils/publishTranslationJob");

const FLASK_API = process.env.FLASK_API || "http://localhost:5000/translate";

/**
 * POST /projects - create new translation project
 */
router.post("/", isAuthenticated, async (req, res) => {
  const { title, domain, sentences, language } = req.body;

  try {
    // Extract texts to translate
    const sourceTexts = sentences.map((s) => s.source);

    // Create unique job ID
    const jobId = uuidv4();

    // Publish job to RabbitMQ (async, non-blocking)
    await publishTranslationJob({
      jobId,
      userId: req.user.userId,
      title,
      domain,
      texts: sourceTexts,
      source_lang: "English",
      target_lang: language,
      context: domain,
    });

    // Immediately respond with jobId, client should listen for completion via websocket or polling
    res.status(202).json({
      jobId,
      message: "Translation job queued successfully. Listen for updates.",
    });
  } catch (error) {
    console.error("Error queuing translation job:", error.message);
    res.status(500).json({ error: "Failed to queue translation job" });
  }
});

/**
 * GET /projects - fetch all projects for user
 */
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const projects = await TranslationProject.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

/**
 * GET /projects/:id - fetch single project
 */
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const project = await TranslationProject.findById(req.params.id);
    if (!project || project.userId !== req.user.userId) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

/**
 * PUT /projects/:id - update translations manually
 */
router.put("/:id", isAuthenticated, async (req, res) => {
  const { sentences } = req.body;

  if (!Array.isArray(sentences)) {
    return res.status(400).json({ error: "Invalid sentence list" });
  }

  try {
    const project = await TranslationProject.findById(req.params.id);
    if (!project || project.userId !== req.user.userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.sentences = sentences.map((s) => ({
      source: s.source,
      translated: s.translated,
      manuallyEdited: true,
    }));

    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

/**
 * DELETE /projects/:id
 */
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const project = await TranslationProject.findByIdAndDelete(req.params.id);
    if (!project || project.userId !== req.user.userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

module.exports = router;
