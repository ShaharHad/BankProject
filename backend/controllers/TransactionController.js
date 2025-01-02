const Account = require('../db_models/account.model');
const dbConnection = require('../db_connection/db_connection');

exports.sendPayment = async(req, res) => {

    const amount = req.body.amount;
    const receiver = req.body.receiver;
    const sender = req.user.email;

    const user = req.user;

    if(!amount || !receiver || !sender){
        return res.status(400).json({message: "One of parameters is empty"});
    }

    if(amount <= 0){
        return res.status(402).json({message:"Amount have to be positive"});
    }

    if(user.balance < amount){
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
            throw new Error('Receiver dont exist');
        }

        const sender_transaction_collection = dbConnection.collection(user._id.toString());
        const receiver_transaction_collection = dbConnection.collection(account_receiver._id.toString());

        if(!sender_transaction_collection || !receiver_transaction_collection){
            throw new Error('Receiver or sender transaction dont exist');
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
            throw new Error('Receiver or sender transaction dont exist');
        }

        const res_receiver = await receiver_transaction_collection.insertOne(transaction);
        if(!res_receiver){
            throw new Error('Receiver or sender transaction dont exist');
        }

        await session.commitTransaction();

        return res.status(200).json({current_balance: user.balance});
    }catch(err){
        await session.abortTransaction();
        return res.status(500).json({message: "Couldn't complete the transaction"});
    }
    finally {
        await session.endSession();
    }
}

exports.deposit = async(req, res) => {
    const amount = req.body.amount;

    if(!amount || 0 >= amount){
        return res.status(400).json({message: "Amount should be exist and positive"});
    }

    const user = req.user;

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
        return res.status(500).json({message: "Couldn't complete the deposit operation"});
    }
    finally {
        await session.endSession();
    }
}

exports.withdraw = async(req, res) => {
    const amount = req.body.amount;

    if(!amount || 0 >= amount){
        return res.status(400).json({message: "Amount should be exist and positive"});
    }

    const user = req.user;

    if(user.balance < amount){
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
        console.error("error: ", err.message);
        return res.status(500).json({message: err.message});
    }

}
