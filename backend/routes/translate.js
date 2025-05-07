const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  const { texts, source_lang, target_lang, context } = req.body;

  try {
    const response = await axios.post(
      process.env.FLASK_API,
      { texts, source_lang, target_lang, context },
      { withCredentials: true }
    );
    const { results } = response.data;
    const translations = results.map(({ translated }) => translated);

    res.json({ translations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
