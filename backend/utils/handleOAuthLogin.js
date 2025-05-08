const User = require("../models/User");
async function handleOAuthLogin(profile, provider) {
  const existingUser = await User.findOne({ userId: profile.id, provider });
  if (existingUser) {
    return existingUser;
  }

  return await User.create({
    userId: profile.id,
    provider,
    name: profile.displayName,
    email: profile.email,
    avatar: profile.avatar,
  });
}

module.exports = { handleOAuthLogin };
