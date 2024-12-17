
exports.changePassword = async(req, res) => {
    try{
        return res.status(200).json({message: "Success to get user data"});
    }

    catch(err){
        return res.status(500).json({message: err.message});
    }
}

exports.getBalance = async(req, res) => {
    if(!req.user){
        return res.status(404).json({message:"Authentication failed"});
    }
    try{
        return res.status(200).json({balance: user.balance});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

exports.getAccount = async(req, res) => {
    if(!req.user){
        return res.status(404).json({message:"Authentication failed"});
    }

    user = req.user.toJSON();
    delete user.password;
    return res.status(200).json(user);
}