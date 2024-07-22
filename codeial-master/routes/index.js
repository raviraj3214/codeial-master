const express = require('express');

const router =  express.Router();

const home_Controller = require('../controllers/home_controller')

// const userController = require('./users');

console.log("router is loading / running")



router.get('/', home_Controller.home );

router.use('/users', require('./users'));

router.use('/posts', require('./posts'));

router.use('/comments', require('./comments'));
router.use('/likes', require('./like'));
router.use('/friends', require('./friendship'));


router.use('/api', require('./api'));



module.exports = router;