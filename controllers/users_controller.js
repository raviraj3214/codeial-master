const User = require('../models/user');

const fs = require('fs');// file system librarry
const path = require('path');

module.exports.profile = function (req, res) {
    User.findById(req.params.id)
        .then((user) => {

            return res.render('user_profile', {
                title: "user profile",
                profile_user: user

            });
        })
}

//update the user info
module.exports.update = async function (req, res) {

    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) { console.log('*****Multer err: ', err) };

                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;

                if (user.avatar) {
                    console.log("dir file exist before unlink : ", fs.existsSync(path.join(__dirname, '..', user.avatar)))
                    // if file or path exist
                    if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                }
                //if request has file
                if (req.file) {
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                //when you use user.name= req.body.name then need to save() in db 
                user.save();

                req.flash('success', 'User profile Updated..')
                return res.redirect('back');
            })
        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'unauthorized..')
        return res.status(401).send('Unauthorized');
    }

}

// render the sign up page
module.exports.signup = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_signup', {
        title: "sign up"
    })
}

// render the sign in page
module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_signin', {
        title: "sign in"
    })
}

//creating the user
module.exports.create = async function (req, res) {

    try {
        if (req.body.password != req.body.confirm_password) {
            console.log("password and confirm_password not matches ");
            return res.redirect('back');
        }

        let user = await User.findOne({ email: req.body.email })//find the user by email
        // if user not found
        if (!user) {
            // create new user
            await User.create(req.body)
            return res.redirect('/users/sign-in');
        } else {
            // return to back or sign-in page
            return res.redirect('back');
        }
    } catch (err) {
        return console.log("Error", err);
    }

}


module.exports.createSession = (function (req, res) {
    req.flash('success', 'seccessfully logged in');
    return res.redirect('/');
});

// used logout and destroy session
module.exports.destroySession = function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        req.flash('success', 'You have logged out !');
        return res.redirect('/');
    });

}

