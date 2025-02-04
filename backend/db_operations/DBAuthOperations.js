const Account = require('../db_models/account.model');

exports.getAccount = async (email) => {
    try{
        return await Account.findOne({email: email}, {transactions: 0});
    }
    catch(err){
        throw err;
    }
}

exports.createAccount = async (obj) => {
    try{
        return await Account.create(obj);
    }
    catch(err){
        throw err;
    }
}

exports.deleteAccount = async (email) => {
    try{
        return await Account.deleteOne({email: email});
    }
    catch(err){
        throw err;
    }
}