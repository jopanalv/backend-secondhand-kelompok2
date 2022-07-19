const { Users, Profiles } = require("../models");
const GoogleStrategy = require("passport-google-oauth20");
const passport = require("passport");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/api/v1/auth/google/callback",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      // check if user already exists
      const currentUser = await Users.findOne({
        where: { googleId: profile.id },
      });
      const emailExist = await Users.findOne({
        where: {
          email: email,
        },
      });
      if (!currentUser && emailExist) {
        await Users.update(
          { googleId: profile.id },
          { where: { email: email } }
        );
      }
      if (currentUser || emailExist) {
        // already have the user -> return (login)

        return done(null, currentUser);
      } else {
        // register user and return
        const newUser = await Users.create({
          email: email,
          googleId: profile.id,
        });
        const newProfile = await Profiles.create({
          UserId: newUser.id,
          name: profile.displayName,
        });
        return done(null, newUser, newProfile);
      }
    }
  )
);
