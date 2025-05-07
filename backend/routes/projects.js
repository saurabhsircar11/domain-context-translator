const express = require("express");
const router = express.Router();
const axios = require("axios");
const TranslationProject = require("../models/TranslationProject");
const isAuthenticated = require("../middleware/auth");

const FLASK_API = process.env.FLASK_API || "http://localhost:5000/translate";

/**
 * POST /projects - create new translation project
 */
router.post("/", isAuthenticated, async (req, res) => {
  const { title, domain, sentences } = req.body;

  try {
    const sourceTexts = sentences.map((s) => s.source);
    const response = await axios.post(
      FLASK_API,
      {
        texts: sourceTexts,
        source_lang: "en",
        target_lang: "fr",
        context: domain,
      },
      { withCredentials: true }
    );

    const translations = response.data.results.map((r) => r.translated);

    const fullSentences = sourceTexts.map((source, i) => ({
      source,
      translation: translations[i],
      manuallyEdited: false,
    }));

    const newProject = new TranslationProject({
      userId: req.user.userId,
      title,
      domain,
      sentences: fullSentences,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error("LLM or DB error:", error.message);
    res.status(500).json({ error: "Failed to create project" });
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

  try {
    const project = await TranslationProject.findById(req.params.id);
    if (!project || project.userId !== req.user.userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Update each sentence
    project.sentences = sentences.map((s) => ({
      source: s.source,
      translation: s.translation,
      manuallyEdited: true,
    }));

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

/**
 * DELETE /projects/:id
 */
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const project = await TranslationProject.findById(req.params.id);
    if (!project || project.userId !== req.user.userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.remove();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

module.exports = router;
