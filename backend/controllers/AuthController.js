const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4;
const fs = require("fs");

const logger = require("../utils/Logger");
const mail = require('../utils/Mail');
const {createError} = require("../utils/CreateError");
const {getAccount, createAccount, deleteAccount} = require("../db_operations/DBAuthOperations");

exports.register = async(req, res, next) => {

    let account_data = req.body;
    try{
        account_data.password = await bcrypt.hash(account_data.password, Number(process.env.SALT));
    }catch(err){
        return next(createError(500, err.message));
    }

    createAccount(account_data).then((account) => {
        if(!account){
            return next(createError(500, "Fail to create account"));
        }

        try{
            mail.sendActivationLink(account.email);
        }catch(err){
            deleteAccount(account_data.email);
            return next(createError(500, "Couldn't send activation link to email"));
        }

        return res.status(200).json({message: "Successfully created account"});

    }).catch((err) => {
        logger.error(err.message);

        if (err.name === "MongoServerError" && err.code === 11000){
            return next(createError(409, "Duplicate account"));
        }
        deleteAccount(account_data.email);
        return next(createError(500, err.message));
    });
}


exports.login = async(req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    getAccount(email).then( async (account) => {
        if(!account){
            return next(createError(404, "Account not found"));
        }
        if(!account.isActive){
            return next(createError(401, "Account not active"));
        }
        const compare_result = await bcrypt.compare(password, account.password);
        if(!compare_result){
            return next(createError(401, "Authentication failed"));
        }

        const token = jwt.sign({email: email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});

        const newAccount = {
            _id: account._id,
            email: account.email,
            name: account.name,
            phone: account.phone,
        }
        return res.status(200).json({token: token, account: newAccount, balance: account.balance});

    }).catch((err) => {
        logger.error(err.message);
        if(err.code !== 500){
            return next(createError(err.code, err.message));
        }
        return next(createError(500, "Server error"));
    })
}

exports.activateAccount = async(req, res, next) => {
    const token  = req.params.token;
    if(!token){
        return next(createError(404, "Missing token"));
    }

    jwt.verify(token, process.env.TOKEN_SECRET,(err, decoded) => {
        if(err){
            return res.send('<h1>Token not valid !!!!</h1>');
        }

        getAccount(decoded.email).then( async (account) => {
            if(!account){
                return res.send('<h1>Account not found !!!!</h1>');
            }

            if(account.isActive){
                logger.warn(`${decoded} Account already activated`);
                return res.send('<h1>Account already activated !!!!</h1>');
            }

            account.isActive = true;

            await account.save();

            return res.send('<h1>Account activated successfully!</h1>');

        }).catch(() => {
            logger.error(err.message);
            if(err.code !== 500){
                return next(createError(err.code, err.message));
            }
            return next(createError(500, "Server error"));
        });
    })
}

exports.generateJitsiToken = async(req, res, next) => {
    try{
        const apiJitsiKey = fs.readFileSync("jitsi.pk", "utf8");
        const apiJitsiId = process.env.JITSI_APP_ID;
        const apiJitsiKid = process.env.JITSI_APP_KID;
        const now = new Date();

        const payload = {
            aud: 'jitsi',
            context: {
                user: {
                    id: uuid(),
                    name: req.user.name,
                    avatar: "",
                    email: req.user.email,
                },
                features: {
                    livestreaming: 'true',
                    recording: 'true',
                    transcription: 'true',
                    "outbound-call": 'true'
                }
            },
            iss: 'chat',
            room: '*',
            sub: apiJitsiId,
            exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
            nbf: (Math.round((new Date).getTime() / 1000) - 10)
        }

        const options = {
            algorithm: 'RS256',
            header: {
                kid: apiJitsiKid
            }
        }

        const token = jwt.sign(payload, apiJitsiKey, options);

        return res.status(200).json({token: token});
    }
    catch(err){
        logger.error(err.message);
        if(err.code !== 500){
            return next(createError(err.code, err.message));
        }
        return next(createError(500, "Server error"));
    }
}

