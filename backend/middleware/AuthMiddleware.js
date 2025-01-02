
const jwt = require('jsonwebtoken');
const User = require('../db_models/account.model');

module.exports = ( async (req, res, next) => {

    const bearer_token = req.headers.authorization;

    if(null == bearer_token || null == bearer_token.split(' ')[1]){
        return res.status(401).json({message: "Access denied"});
    }

    const token = bearer_token.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
        if(err){
            return res.status(401).json({message: "token not valid"});
        }

        User.findOne({email: decode.email}).then((user) => {

            if(null == user){
                return res.status(401).json({message: "Authentication failed"});
            }

            req.user = user;
            next();
        }).catch((err) => {
            return res.status(500).json({message: err.message});
        })
    });
});

