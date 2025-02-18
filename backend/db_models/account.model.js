const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
        isRead: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            required: [true, "Message cannot be empty"]
        },
    }, {timestamps: true}
);

const AccountSchema = mongoose.Schema({
        email: {
            type: String,
            required: [true, "Please enter email"], // second item in array is custom massage !!!
            unique: true
        },
        password:{
            type: String,
            required: [true, "Please enter password"]
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
        },
        transactions: {
            type: Array,
            default: []
        },
        messages: {
            readMessages:{
                type: [MessageSchema],
                default: []
            },
            unreadMessages:{
                type: [MessageSchema],
                default: []
            }
        }
    },
    {
        timestamps: true
    }
);

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;