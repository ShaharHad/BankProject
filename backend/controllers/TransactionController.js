const User = require('../db_models/user.model');
const dbConnection = require('../db_connection/db_connection');

exports.sendPayment = async(req, res) => {

    const payment = req.body.payment;
    const receiver = req.body.reciever;

    const user = req.user;

    if(!payment || !receiver){
        return res.status(401).json({message: "One of the parameters are null"});
    }

    if(user.balance < payment){
        return res.status(402).json({message: "User dont have enough money"});
    }

    const session = await dbConnection.startSession();

    session.startTransaction();

    try{

        user.balance -= payment;
        await user.save();

        const res = await User.findOneAndUpdate({email: receiver}, {balance: payment});
        if(!res){
            throw new Error('Receiver dont exist');
        }



        await session.commitTransaction();

    }catch(err){
        await session.abortTransaction();
        return res.status(500).json({message: "Couldn't complete the transaction"});
    }
    finally {
        await session.endSession();
    }




}
