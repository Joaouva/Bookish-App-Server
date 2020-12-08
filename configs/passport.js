const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../models/user-model");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//Set the user in the session - login
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});
//Gets the user from the session req.user
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});
//Authenticate using passport
passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }
      if (!foundUser) {
        next(null, false, { message: "Incorrect username." });
        return;
      }
      if (!bcrypt.compareSync(password, foundUser.password)) {
        next(null, false, { message: "Incorrect password." });
        return;
      }
      next(null, foundUser);
    });
  })
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, user, done) => {
      User.findOne({ googleId: user.id })
        .then((user) => {
          if (user) {
            // authenticate and persist in session
            done(null, user);
            return;
          }
          User.create({ googleId: user.id, username: user.displayName })
            .then((newUser) => {
              done(null, newUser);
            })
            .catch((err) => done(err)); // closes User.create()
        })
        .catch((err) => done(err)); // closes User.findOne()
    }
  )
);
