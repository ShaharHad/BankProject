
exports.changePassword = async(req, res) => {
    try{
        return res.status(200).json({message: "success to get user data"});
    }

    catch(err){
        return res.status(500).json({message: err.message});
    }
}