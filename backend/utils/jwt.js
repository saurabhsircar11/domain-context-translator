const jwt = require("jsonwebtoken");

function generateToken(user) {
  console.log("saurabh", user);
  return jwt.sign(
    {
      id: user._id,
      userId: user.userId,
      name: user.displayName,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = { generateToken };
