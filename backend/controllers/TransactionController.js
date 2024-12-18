const Account = require('../db_models/account.model');
const dbConnection = require('../db_connection/db_connection');

exports.sendPayment = async(req, res) => {

    const payment = req.body.payment;
    const receiver = req.body.receiver;
    const sender = req.body.sender;

    const user = req.user;

    if(!payment || !receiver || !sender){
        return res.status(400).json({message: "One of parameters is empty"});
    }

    if(payment <= 0){
        return res.status(402).json({message:"Payment have to be positive"});
    }

    if(user.balance < payment){
        return res.status(402).json({message: "User dont have enough money"});
    }
    const session = await dbConnection.startSession();
    session.startTransaction();
    try{

        user.balance -= payment;
        await user.save();

        const account_receiver = await Account.findOneAndUpdate(
            {email: receiver},
            {$inc: {balance: payment}},
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
            payment: payment,
            receiver: receiver,
            sender: sender
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
    const payment = req.body.payment;

    if(!payment || 0 >= payment){
        return res.status(400).json({message: "Payment should be exist and positive"});
    }

    const user = req.user;

    user.balance += payment;

    user.save().then(() => {
        return res.status(200).json({current_balance: user.balance});
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({message: "Couldn't complete the transaction"});
    });

}

exports.withdraw = async(req, res) => {
    const payment = req.body.payment;

    if(!payment || 0 >= payment){
        return res.status(400).json({message: "Payment should be exist and positive"});
    }

    const user = req.user;

    if(user.balance < payment){
        return res.status(402).json({message: "User dont have enough money"});
    }

    user.balance -= payment;

    user.save().then(() => {
        return res.status(200).json({current_balance: user.balance});
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({message: "Couldn't complete the transaction"});
    });
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

        return res.status(200).json({transactions: user_transactions});
    }catch(err){
        console.error("error: ", err.message);
        return res.status(500).json({message: err.message});
    }

}
