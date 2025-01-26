const {createError} = require("../utils/CreateError");
// TODO finish the change password endpoint
exports.changePassword = async(req, res, next) => {
    try{
        return res.status(200).json({message: "Success to get user data"});
    }

    catch(err){
        return next(createError(500, err.message));
    }
}

exports.getBalance = async(req, res, next) => {
    if(!req.user){
        return next(createError(404, "User not found"));
    }
    return res.status(200).json({balance: req.user.balance});

}

exports.getAccount = async(req, res, next) => {
    if(!req.user){
        return next(createError(404, "User not found"));
    }

    user = req.user.toJSON();
    delete user.password;
    return res.status(200).json(user);
}