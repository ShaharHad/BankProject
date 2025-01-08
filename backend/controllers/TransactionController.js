const Account = require('../db_models/account.model');
const dbConnection = require('../db_connection/db_connection');
const logger = require("../utils/Logger");

exports.sendPayment = async(req, res) => {

    const user = req.user;

    if(!req.body.hasOwnProperty("amount") || !req.body.hasOwnProperty("receiver")){
        logger.error(`${user.email} send empty parameters`);
        return res.status(400).json({message: "One of parameters is empty"});
    }

    const amount = req.body.amount;
    const receiver = req.body.receiver;
    const sender = user.email;

    if(amount <= 0){
        logger.error(`${user.email} send 0 or less then of amount`);
        return res.status(402).json({message:"Amount should be positive and greater then 0"});
    }

    if(user.balance < amount){
        logger.error(`${user.email} dont have enough money`);
        return res.status(402).json({message: "User dont have enough money"});
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
            const error = new Error('Receiver dont exist');
            error.status = 404;
            throw error;
        }

        const sender_transaction_collection = dbConnection.collection(user._id.toString());
        const receiver_transaction_collection = dbConnection.collection(account_receiver._id.toString());

        if(!sender_transaction_collection || !receiver_transaction_collection){
            const error = new Error('Receiver or sender transaction dont exist');
            error.status = 404;
            throw error;
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
            const error = new Error('Receiver or sender transaction dont exist');
            error.status = 404;
            throw error;
        }

        const res_receiver = await receiver_transaction_collection.insertOne(transaction);
        if(!res_receiver){
            const error = new Error('Receiver or sender transaction dont exist');
            error.status = 404;
            throw error;
        }

        await session.commitTransaction();
        return res.status(200).json({current_balance: user.balance});
    }catch(err){
        await session.abortTransaction();
        if(err.status && err.status === 404){
            logger.error(`${user.email} dont send receiver`);
            return res.status(404).json({message: "Receiver don't exist"});
        }
        logger.error(`Couldn't complete the transaction for ${user.email}`);
        return res.status(500).json({message: "Couldn't complete the transaction"});
    }
    finally {
        await session.endSession();
    }
}

exports.deposit = async(req, res) => {

    const user = req.user;

    if(!req.body.hasOwnProperty("amount")){
        logger.error(`${req.user.email} send empty parameters`);
        return res.status(400).json({message: "Amount should be exist"});
    }

    const amount = req.body.amount;

    if(0 >= amount){
        logger.error(`${req.user.email} not send amount or the amount is negative`);
        return res.status(402).json({message: "Amount should be positive and greater then 0"});
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
        logger.error(`Couldn't complete the deposit operation`);
        return res.status(500).json({message: "Couldn't complete the deposit operation"});
    }
    finally {
        await session.endSession();
    }
}

exports.withdraw = async(req, res) => {
    const user = req.user;

    if(!req.body.hasOwnProperty("amount")){
        logger.error(`${req.user.email} send empty parameters`);
        return res.status(400).json({message: "Amount should be exist"});
    }

    const amount = req.body.amount;

    if(0 >= amount){
        logger.error(`${req.user.email} not send amount or the amount is negative`);
        return res.status(402).json({message: "Amount should be positive and greater then 0"});
    }

    else if(user.balance < amount){
        logger.error(`${user.email} dont have sufficient amount`);
        return res.status(402).json({message: "User dont have enough money"});
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
        logger.error(`Couldn't complete the withdraw operation`);
        return res.status(500).json({message: "Couldn't complete the withdraw operation"});
    }
    finally {
        await session.endSession();
    }
}

exports.getTransactions = async(req, res) => {

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
        return res.status(500).json({message: err.message});
    }

}
