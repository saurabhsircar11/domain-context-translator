const passport = require("passport");
const { handleOAuthLogin } = require("../utils/handleOAuthLogin");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await handleOAuthLogin(profile, "google");
      return done(null, user);
    }
  )
);
