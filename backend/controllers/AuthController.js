const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const dbConnection = require('../db_connection/db_connection');
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

        const collection_name = account._id.toString();

        dbConnection.createCollection(collection_name).then(() => {
            return res.status(200).json({message: "Successfully created account"});
        }).catch(() => {
            deleteAccount(account_data.email).then(() => {
                return next(createError(500, "Fail to create transaction collection"));
            })
        });
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
            return next(createError(500, "server error"));
        }

        getAccount(decoded.email).then( async (account) => {
            if(!account){
                return next(createError(404, "Account not found"));
            }

            if(account.isActive){
                logger.warn(`${decoded} Account already activated`);
                return res.send('<h1>Account already activated !!!!</h1>');
            }

            account.isActive = true;

            await account.save();

            return res.send('<h1>Account activated successfully!</h1>');

        }).catch(() => {
            return next(createError(500, "server error"));
        });
    })
}

//TODO reset password functionality
// exports.resetPassword = async(req, res, next) => {
//     const email = req.body.email;
//
// }



