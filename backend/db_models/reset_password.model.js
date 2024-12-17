const mongoose = require('mongoose');

const ResetPasswordTokenSchema = mongoose.Schema({
        reset_token: {
            type: String,
            required: [true, "Please enter token"], // second item in array is custome massage !!!
            unique: true
        },

        user_id:{
            type: String,
            required: [true, "Please enter user id"]
        },
        balance: {
            type: Number,
            default: 500
        }
    },
    {
        timestamps: true
    }
);

const ResetPassword = mongoose.model("User", ResetPasswordSchema);

module.exports = ResetPassword;