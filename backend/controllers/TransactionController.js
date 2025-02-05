const logger = require("../utils/Logger");
const {createError} = require("../utils/CreateError");
const {updateAccount, getTransactions, transferMoney} = require("../db_operations/DBTransactionOperation");

exports.sendPayment = async(req, res, next) => {

    const user = req.user;
    const amount = req.body.amount;
    const receiver = req.body.receiver;
    const sender = user.email;

    if(user.balance < amount){
        return next(createError(402, "User dont have enough money"));
    }

    const transaction = {
        payment: amount,
        receiver: receiver,
        sender: sender,
        type: "transfer",
        timestamp: Math.floor(Date.now() / 1000)
    }

    transferMoney(sender, receiver, transaction).then(() => {
        return res.status(200).json({current_balance: user.balance - amount});
    }).catch((err) => {
        logger.error(err.message);
        if(err.code !== 500){
            return next(createError(err.code, err.message));
        }
        return next(createError(500, "Couldn't complete the transfer"));
    });
}

exports.deposit = async(req, res, next) => {

    const user = req.user;
    const amount = req.body.amount;

    try{

        const transaction = {
            payment: amount,
            receiver: user.email,
            sender: user.email,
            type: 'deposit',
            timestamp: Math.floor(Date.now() / 1000)
        }

        await updateAccount(
            {email: user.email},
            {$push: {transactions: transaction}, $inc: {balance: amount}}
        );

        return res.status(200).json({current_balance: user.balance + amount});
    }catch(err){
        if(err.status && err.status !== 500){
            return next(createError(err.status, err.message));
        }
        return next(createError(500, "Couldn't complete the deposit operation"));
    }
}

exports.withdraw = async(req, res, next) => {

    const user = req.user;
    const amount = req.body.amount;

    if(user.balance < amount){
        return next(createError(402, "User dont have enough money"));
    }

    try{
        const transaction = {
            payment: amount,
            receiver: user.email,
            sender: user.email,
            type: 'withdraw',
            timestamp: Math.floor(Date.now() / 1000)
        }

        await updateAccount(
            {email: user.email},
            {$push: {transactions: transaction}, $inc: {balance: -amount}}
        );

        return res.status(200).json({current_balance: user.balance - amount});
    }catch(err){
        if(err.status && err.status !== 500){
            return next(createError(err.status, err.message));
        }
        return next(createError(500, "Couldn't complete the withdraw operation"));
    }
}

exports.getTransactions = async(req, res, next) => {

    try{
        const user = req.user;

        const transactions =  await getTransactions({email: user.email});

        return res.status(200).json(transactions.transactions);
    }catch(err){
        logger.error(err.message);
        return next(createError(500, err.message));
    }

}
