const Account = require('../db_models/account.model');
const dbConnection = require('../db_connection/db_connection');
const {createError} = require("../utils/CreateError");


const updateAccount = async (objToUpdate, fieldsToUpdate) => {
    try{
        return await Account.findOneAndUpdate(objToUpdate, fieldsToUpdate, {new: true});
    }
    catch(err){
        throw err;
    }
}


const transferMoney = async (sender, receiver, transaction) => {
    const session = await dbConnection.startSession();
    session.startTransaction();
    try{

        await updateAccount(
            {email: sender},
            {$push: {transactions: transaction}, $inc: {balance: -transaction.payment}}
        );

        const account_receiver = await updateAccount(
            {email: receiver},
            {$push: {transactions: transaction}, $inc: {balance: transaction.payment}}
        );

        if(!account_receiver){
            throw createError(404, "Receiver doesn't exist");
        }

        await session.commitTransaction();

    } catch(err){
        await session.abortTransaction();
        throw err;
    }
    finally {
        await session.endSession();
    }
}

const getTransactions = async(documentToGet) => {
    try{
        return await Account.findOne(documentToGet).select("transactions");
    }
    catch(err){
        throw err;
    }
}

module.exports = {
    transferMoney,
    updateAccount,
    getTransactions,
}