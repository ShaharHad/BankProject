const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
        amount: {
            type: Number,
            required: [true, "Please enter amount"], // second item in array is custom massage !!!
        },
        receiver:{
            type: String,
            required: [true, "Please enter receiver"]
        },
        type:{
            type: String,
            required: [true, "Please enter receiver"]
        }
    },
    {
        timestamps: true
    }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;