const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opt = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial'
}


passport.use(new JWTStrategy(opt, function (jwt_payload, done) {
    User.findById(jwt_payload._id)
        //using primises to get user
        .then((user) => {
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
        
        .catch((err) => {
            console.log('**** err infinding user from jwt: ', err);
            return done(err, false);
        })



}))

module.exports = passport;