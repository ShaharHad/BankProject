const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../db_models/user.model');
const dbConnection = require('../db_connection/db_connection');

exports.register = async(req, res) => {

    if(!req.body.email || !req.body.name || !req.body.password || !req.body.phone){
        return res.status(401).json({message: "One of parameters is empty"});
    }
    let user_data = req.body;
    try{
        user_data.password = await bcrypt.hash(user_data.password, Number(process.env.HASH_NUMBER));
    }catch(err){
        return res.status(500).json({message: err.message});
    }

    User.create(user_data).then((user) => {
        if(!user){
            return res.status(500).json({message: "Fail to create user"});
        }

        const collection_name = user._id.toString();

        dbConnection.createCollection(collection_name).then(() => {
            return res.status(200).json({message: "Successfully created user"});
        }).catch((err) => {
            console.error(err);
            User.deleteOne({email: user_data.email}).then(() => {
                return res.status(500).json({message: "Fail to create transaction collection"});
            })
        });
    }).catch((err) => {
        if (err.name === "MongoServerError" && err.code === 11000){
            return res.status(401).json({message: "Duplicate user"});
        }
        return res.status(500).json({message: err.message});
    });
}

exports.login = async(req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    if(!req.body.email ||  !req.body.password){
        return res.status(401).json({message: "One of parameters is empty"});
    }

    await User.findOne({email: email}).then(async (user) => {
        if(!user){
            return res.status(401).json({message: "user not found"});
        }

        const compare_result = await bcrypt.compare(password, user.password);
        if(!compare_result){
            return res.status(401).json({message: "Authentication failed"});
        }

        const token = jwt.sign({email: email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
        
        res.cookie('token', token, {
            httpOnly: true, 
            sameSite: true,
        });

        const newUser = {
            email: user.email,
            name: user.name,
            phone: user.phone,
        }

        return res.status(200).json(newUser);
    }).catch((err) => {
        console.log(err.message);
        return res.status(500).json({message: "Server error"});
    })

}



