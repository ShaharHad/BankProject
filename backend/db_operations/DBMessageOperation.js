const Account = require("../db_models/account.model");

exports.markedMessageAsRead = async(query, update, options) => {

    try{
        await Account.findOneAndUpdate(query, update, options);
    } catch(err) {
        throw err;
    }
}


exports.getAllMessagesFromAccount = async(query) => {
    try{
        return await Account.findOne(query).select("messages");
    }catch(err){
        throw err;
    }
}