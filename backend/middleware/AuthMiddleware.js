
const jwt = require('jsonwebtoken');
const Account = require('../db_models/account.model');
const logger = require('../utils/Logger');
const urlExclude = "auth";

module.exports = ( async (req, res, next) => {
    if(req.originalUrl.includes(urlExclude)){
        return next();
    }
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

        Account.findOne({email: decode.email}).then((account) => {

            if(null == account){
                logger.warn("account " + decode.email + " not found");
                return res.status(401).json({message: "Authentication failed"});
            }

            req.user = account;
            return next();
        }).catch((err) => {
            logger.error(err.message);
            return res.status(500).json({message: err.message});
        })
    });
});

