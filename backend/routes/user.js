const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    console.log("saurabh", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
