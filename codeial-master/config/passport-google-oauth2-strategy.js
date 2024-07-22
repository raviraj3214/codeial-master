const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: "843008452683-g4svkjvie2nin79gsi5je8m700lpu65m.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {

            // console.log('accessToken: ', accessToken);
            // console.log('refreshToken: ', refreshToken);
            // console.log('profile: ', profile);
            let user = await User.findOne({ email: profile.emails[0].value }).exec();

            if (user) {
                // console.log('user found: ', user);
                return done(null, user);
            } else {

                User.create({
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    password: crypto.randomBytes(20).toString('hex')
                })
                
                    .then((user) => {
                        // console.log('user Not found so Created user: ', user);
                        done(null, user);
                    })

                    .catch((err) => {
                        return console.log("error in creating user google strategy: ", err);
                    })
            }


        } catch (err) {
            return console.log("error in google strategy",err);

        }

    }
));


module.exports = passport;