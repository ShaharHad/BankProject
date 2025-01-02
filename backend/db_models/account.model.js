const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
        email: {
            type: String,
            required: [true, "Please enter enter email"], // second item in array is custome massage !!!
            unique: true
        },
        password:{
            type: String,
            required: true
        },

        name: {
            type: String,
            required: [true, "Please enter name"]
        },

        phone:{
            type: String,
            required: [true, "Please enter phone"]
        },
        balance: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;