const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authintication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
},
    function (req, email, password, done) {
        
        User.findOne({ email: email })
            .then((user) => {
                if (!user || user.password != password) {
                    req.flash('error','invalid username/password');
                    return done(null, false);
                }

                return done(null, user);
            })

            .catch((err) => {
                req.flash('error', err);
                return done(err);
            })
    }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null,user.id);
})


// deserialize the user from the key in cookies
passport.deserializeUser(function(id, done){
    User.findById(id)
    .then((user)=>{
        return done(null, user);
    })

    .catch((err)=>{
        console.log("Error in finding user ---> passport");
        return done(err);
    })
})

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if the user not signed in 
    return res.redirect('/users/sign-in');
}


passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.uer contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}
module.exports = passport;