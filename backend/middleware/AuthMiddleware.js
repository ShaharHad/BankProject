
const jwt = require('jsonwebtoken');
const User = require('../db_models/account.model');
const logger = require('../utils/Logger');

// const excludeRoutes = ["/auth/register", "/auth/login"];

module.exports = ( async (req, res, next) => {

    // if(excludeRoutes.includes(req.path)){
    //     return next();
    // }
    const bearer_token = req.headers.authorization;

    if(null == bearer_token || null == bearer_token.split(' ')[1]){
        logger.warn('No authorization token');
        return res.status(401).json({message: "Access denied"});
    }

    const token = bearer_token.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
        if(err){
            logger.warn("token not valid");
            return res.status(401).json({message: "token not valid"});
        }

        User.findOne({email: decode.email}).then((user) => {

            if(null == user){
                logger.warn("user " + decode.email + " not found");
                return res.status(401).json({message: "Authentication failed"});
            }

            req.user = user;
            next();
        }).catch((err) => {
            logger.error(err.message);
            return res.status(500).json({message: err.message});
        })
    });
});

