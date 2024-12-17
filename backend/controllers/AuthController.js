const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Account = require('../db_models/account.model');
const dbConnection = require('../db_connection/db_connection');

exports.register = async(req, res) => {

    if(!req.body.email || !req.body.name || !req.body.password || !req.body.phone){
        return res.status(400).json({message: "One of parameters is empty"});
    }
    let account_data = req.body;
    try{
        account_data.password = await bcrypt.hash(account_data.password, Number(process.env.HASH_NUMBER));
    }catch(err){
        return res.status(500).json({message: err.message});
    }

    Account.create(account_data).then((account) => {
        if(!account){
            return res.status(500).json({message: "Fail to create account"});
        }

        const collection_name = account._id.toString();

        dbConnection.createCollection(collection_name).then(() => {
            return res.status(200).json({message: "Successfully created account"});
        }).catch((err) => {
            console.error(err);
            Account.deleteOne({email: account_data.email}).then(() => {
                return res.status(500).json({message: "Fail to create transaction collection"});
            })
        });
    }).catch((err) => {
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
        return res.status(400).json({message: "One of parameters is empty"});
    }

    await Account.findOne({email: email}).then(async (account) => {
        if(!account){
            return res.status(404).json({message: "Account not found"});
        }

        const compare_result = await bcrypt.compare(password, account.password);
        if(!compare_result){
            return res.status(400).json({message: "Authentication failed"});
        }

        const token = jwt.sign({email: email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
        
        res.cookie('token', token, {
            httpOnly: true, 
            sameSite: true,
        });

        const newAccount = {
            _id: account._id,
            email: account.email,
            name: account.name,
            phone: account.phone,
            balance: account.balance
        }

        return res.status(200).json(newAccount);
    }).catch((err) => {
        console.log(err.message);
        return res.status(500).json({message: "Server error"});
    });
}

//TODO if there is time
exports.resetPassword = async(req, res) => {
    const email = req.body.email;

}



