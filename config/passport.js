const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://story-book-app-markson.onrender.com/auth/google/callback',
      },
    async (accessToken, refreshToken, profile, done) => {
      const userData = {
        authId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value
      };

      try {
        let user = await User.findOne({ authId: profile.id });

        if (user) {
          done(null, user);
        } else {
          user = await User.create(userData);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
        done(err);
      }
    }
  ));
  let MicrosoftStrategy = require('passport-microsoft').Strategy;
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: 'https://story-book-app-markson.onrender.com/auth/microsoft/callback',
        scope: ['user.read'],

        tenant: 'common',
      },
      async (accessToken, refreshToken, profile, done) => {
        const userData = {
          authId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        };

        try {
          let user = await User.findOne({ authId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(userData);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });
};
