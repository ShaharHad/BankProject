const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Account = require('../db_models/account.model');
const dbConnection = require('../db_connection/db_connection');
const logger = require("../utils/Logger");
const mail = require('../utils/Mail');

exports.register = async(req, res) => {
    // TODO create validation for parameters email and phone
    if(!req.body.email || !req.body.name || !req.body.password || !req.body.phone){
        logger.error(`One of parameters is empty`);
        return res.status(400).json({message: "One of parameters is empty"});
    }
    let account_data = req.body;
    try{
        account_data.password = await bcrypt.hash(account_data.password, Number(process.env.SALT));
    }catch(err){
        logger.error(`${req.body.email}: ${err.message}`);
        return res.status(500).json({message: err.message});
    }
    Account.create(account_data).then((account) => {
        if(!account){
            logger.error(`Fail to create account for ${req.body.email}`);
            return res.status(500).json({message: "Fail to create account"});
        }

        try{
            mail.sendActivationLink(account.email);
        }catch(err){
            Account.deleteOne({email: mail});
            return res.status(500).json({message: "Couldn't send activation link to email"});
        }

        const collection_name = account._id.toString();

        dbConnection.createCollection(collection_name).then(() => {
            return res.status(200).json({message: "Successfully created account"});
        }).catch((err) => {
            logger.error(err.message);
            Account.deleteOne({email: account_data.email}).then(() => {
                return res.status(500).json({message: "Fail to create transaction collection"});
            })
        });
    }).catch((err) => {
        logger.error(err.message);
        Account.deleteOne({email: account_data.email});
        if (err.name === "MongoServerError" && err.code === 11000){
            return res.status(409).json({message: "Duplicate account"});
        }
        return res.status(500).json({message: err.message});
    });
}


exports.login = async(req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    if(!req.body.email ||  !req.body.password){
        logger.error(`One of parameters is empty`);
        return res.status(400).json({message: "One of parameters is empty"});
    }

     Account.findOne({email: email}).then(async (account) => {
        if(!account){
            logger.error(`Account not found for ${req.body.email}`);
            return res.status(404).json({message: "Account not found"});
        }

         if(!account.isActive){
            return res.status(401).json({message: "Account not active"});
        }

        const compare_result = await bcrypt.compare(password, account.password);
        if(!compare_result){
            logger.error(`Authentication failed for ${req.body.email}`);
            return res.status(401).json({message: "Authentication failed"});
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
        return res.status(500).json({message: "Server error"});
    });
}

exports.activateAccount = async(req, res) => {
    const {token} = req.query;
    if(!token){
        return res.status(404).json({message: "Missing token"});
    }

    jwt.verify(token, process.env.TOKEN_SECRET,(err, decoded) => {
        if(err){
            logger.error(err.message);
            res.status(500).json({message: "server error"});
        }
        Account.findOne({email: decoded.email}).then(async (account) => {
            if(!account){
                logger.error(`${decoded} account not found`);
                return res.status(404).json({message: "Account not found"});
            }

            if(account.isActive){
                logger.warn(`${decoded} Account already activated`);
                return res.send('<h1>Account already activated !!!!</h1>');
            }

            account.isActive = true;

            await account.save();

            return res.send('<h1>Account activated successfully!</h1>');

        }).catch((err) => {
            logger.error(err.message);
            return res.status(500).json({message: "server error"});
        });
    })
}

//TODO reset password functionality
exports.resetPassword = async(req, res) => {
    const email = req.body.email;

}



