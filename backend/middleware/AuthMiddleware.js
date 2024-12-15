
const jwt = require('jsonwebtoken');
const User = require('../db_models/user.model');

module.exports = ( async (req, res, next) => {
    
    const {token} = req.cookies;

    console.log(token);

    const token2 = req.header('Authorization');
    if(null == token2){
        return res.status(401).json({message: "Access denied"});
    }

    jwt.verify(token2, process.env.TOKEN_SECRET, (err, decode) => {
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

