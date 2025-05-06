const express = require("express");
const authenticate = require("../middleware/auth");
const router = express.Router();

router.get("/me", authenticate, (req, res) => {
  res.json(req.user); // user info decoded from the JWT
});

module.exports = router;
