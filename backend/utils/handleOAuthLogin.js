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
    email: profile.emails?.[0]?.value,
    avatar: profile.photos?.[0]?.value,
  });
}

module.exports = { handleOAuthLogin };
