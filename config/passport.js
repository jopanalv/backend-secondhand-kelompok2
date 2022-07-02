const { Users, Profiles } = require("../models");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
function initializePassport(passport) {
  const authenticateGoogleUser = async (
    accessToken,
    refreshToken,
    profile,
    done
  ) => {
    const foundUser = await Users.findOne({ where: { googleId: profile.id } });
    if (foundUser) {
      console.log(foundUser);
      done(null, foundUser);
    } else {
      console.log(profile.name.givenName);
      console.log(profile);
      const newUser = await Users.create({
        email: profile._json.email,
        googleId: profile.id,
      });
      const newProfile = await Profiles.create({
        name: profile.givenName || "",
      });

      console.log(newUser);
      console.log(newProfile);
      done(null, newUser, newProfile);
    }
  };

  passport.use(
    new GoogleStrategy(
      {
        callbackURL: "/api/v1/auth/google/callback",
        clientID:
          "108363600535-pj7l7gokloqlrkde5r5p3dr8k51p0d9p.apps.googleusercontent.com",
        clientSecret: "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",
      },
      authenticateGoogleUser
    )
  );
  passport.serializeUser((user, done) => {
    console.log("serialize user", user);
    console.log(user.id);
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    console.log(id);

    Users.findOne({
      where: {
        id: id,
      },
    }).then((user) => {
      if (user) {
        const userInfo = {
          email: user.email,
          role: user.role,
        };
        console.log("user  hai", userInfo);
        done(null, userInfo);
      } else {
        done(null, false);
      }
    });
  });
}

module.exports = initializePassport;
