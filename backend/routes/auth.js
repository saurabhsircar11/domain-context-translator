const express = require("express");
const passport = require("passport");

const { generateToken } = require("../utils/jwt");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.redirect(process.env.FRONTEND_DASHBOARD);
  }
);

module.exports = router;
