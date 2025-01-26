const Account = require('../db_models/account.model');
const dbConnection = require('../db_connection/db_connection');
const logger = require("../utils/Logger");
const {createError} = require("../utils/CreateError");

exports.sendPayment = async(req, res, next) => {

    const user = req.user;

    if(!req.body.hasOwnProperty("amount") || !req.body.hasOwnProperty("receiver")){
        return next(createError(400, "One of the parameters is empty"));
    }

    const amount = req.body.amount;
    const receiver = req.body.receiver;
    const sender = user.email;

    if(amount <= 0){
        return next(createError(402, "Amount should be positive and greater then 0"));
    }

    if(user.balance < amount){
        return next(createError(402, "User dont have enough money"));
    }
    const session = await dbConnection.startSession();
    session.startTransaction();
    try{

        user.balance -= amount;
        await user.save();

        const account_receiver = await Account.findOneAndUpdate(
            {email: receiver},
            {$inc: {balance: amount}},
            { new: true });
        if(!account_receiver){
            throw createError(404, "Receiver dont exist")
        }

        const sender_transaction_collection = dbConnection.collection(user._id.toString());
        const receiver_transaction_collection = dbConnection.collection(account_receiver._id.toString());

        if(!sender_transaction_collection || !receiver_transaction_collection){
            throw createError(404, "Receiver or sender transaction dont exist")
        }

        const transaction = {
            payment: amount,
            receiver: receiver,
            sender: sender,
            type: "transfer",
            timestamp: Math.floor(Date.now() / 1000)
        }

        const res_sender = await sender_transaction_collection.insertOne(transaction);
        if(!res_sender){
            throw createError(404, "Receiver or sender transaction dont exist")
        }

        const res_receiver = await receiver_transaction_collection.insertOne(transaction);
        if(!res_receiver){
            throw createError(404, "Receiver or sender transaction dont exist")
        }

        await session.commitTransaction();
        return res.status(200).json({current_balance: user.balance});
    }catch(err){
        await session.abortTransaction();
        if(err.status && err.status === 404){
            return next(createError(404, "Receiver don't exist"));
        }
        return next(createError(500, "Couldn't complete the transaction"));
    }
    finally {
        await session.endSession();
    }
}

exports.deposit = async(req, res, next) => {

    const user = req.user;

    if(!req.body.hasOwnProperty("amount")){
        return next(createError(400, "Amount should be exist"));
    }

    const amount = req.body.amount;

    if(0 >= amount){
        return next(createError(402, "Amount should be positive and greater then 0"));
    }


    const session = await dbConnection.startSession();
    session.startTransaction();
    try{

        user.balance += amount;
        await user.save();

        const transaction_collection = dbConnection.collection(user._id.toString());

        if(!transaction_collection){
            throw new Error('Receiver or sender transaction dont exist');
        }

        const transaction = {
            payment: amount,
            receiver: user.email,
            sender: user.email,
            type: 'deposit',
            timestamp: Math.floor(Date.now() / 1000)
        }

        await transaction_collection.insertOne(transaction);

        await session.commitTransaction();

        return res.status(200).json({current_balance: user.balance});
    }catch(err){
        await session.abortTransaction();
        return next(createError(500, "Couldn't complete the deposit operation"));
    }
    finally {
        await session.endSession();
    }
}

exports.withdraw = async(req, res, next) => {
    const user = req.user;

    if(!req.body.hasOwnProperty("amount")){
        return next(createError(400, "Amount should be exist"));
    }

    const amount = req.body.amount;

    if(0 >= amount){
        return next(createError(402, "Amount should be positive and greater then 0"));
    }

    else if(user.balance < amount){
        return next(createError(402, "User dont have enough money"));
    }

    const session = await dbConnection.startSession();
    session.startTransaction();
    try{

        user.balance -= amount;
        await user.save();

        const transaction_collection = dbConnection.collection(user._id.toString());

        if(!transaction_collection){
            throw new Error('Account transaction dont exist');
        }

        const transaction = {
            payment: amount,
            receiver: user.email,
            sender: user.email,
            type: 'withdraw',
            timestamp: Math.floor(Date.now() / 1000)
        }

        await transaction_collection.insertOne(transaction);

        await session.commitTransaction();

        return res.status(200).json({current_balance: user.balance});
    }catch(err){
        await session.abortTransaction();
        return next(createError(500, "Couldn't complete the withdraw operation"));
    }
    finally {
        await session.endSession();
    }
}

exports.getTransactions = async(req, res, next) => {

    try{
        const user = req.user;

        const user_transaction_collection = dbConnection.collection(user._id.toString());

        const documents = await user_transaction_collection.find().toArray();

        const user_transactions = documents.map((doc) => {
            JSON.parse(JSON.stringify(doc));
            return doc;
        });

        return res.status(200).json(user_transactions);
    }catch(err){
        logger.error(err.message);
        return next(createError(500, err.message));
    }

}
