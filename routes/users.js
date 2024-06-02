const express = require('express');

const router = express.Router();

const userController = require('../controllers/users_controller');

const passport = require('passport');

// router.get('/', userController.home);
router.get('/profile/:id',passport.checkAuthentication, userController.profile);

router.post('/update/:id',passport.checkAuthentication, userController.update);

router.get('/sign-up', userController.signup);
router.get('/sign-in', userController.signin);

router.post('/create', userController.create);

// use passport as a middleware authentication
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
),userController.createSession);

router.get('/sign-out', userController.destroySession);


//passport google-oauthentication for signin
router.get('/auth/google', passport.authenticate('google', {scope: [ 'profile', 'email']}));

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.createSession)


module.exports = router;