const { json } = require('express');
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function (req, res) {

    try{

        let user = await User.findOne({email: req.body.email})

        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message:"invalid username or password "
            })
        }

            return res.status(200).json({
                message:" singin successfull here is your token plzz keepit safe",
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '1000000'})
            })

    }catch(err){
        console.Console('***err :', err);
        return res.status(500).json({
            message: "internal server error"
        })
    }
};


