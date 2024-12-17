
const jwt = require('jsonwebtoken');
const User = require('../db_models/account.model');

module.exports = ( async (req, res, next) => {

    if(null == req.cookies){
        return res.status(401).json({message: "Access denied"});
    }

    const {token} = req.cookies;

    if(null == token){
        return res.status(401).json({message: "Access denied"});
    }

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

