const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
        payment: {
            type: Number,
            required: [true, "Please enter amount"], // second item in array is custome massage !!!
        },
        receiver:{
            type: String,
            required: true
        },
        sender:{
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;