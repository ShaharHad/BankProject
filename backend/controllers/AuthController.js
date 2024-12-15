const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../db_models/user.model');

exports.register = async(req, res) => {

    if(!req.body.email || !req.body.name || !req.body.password || !req.body.phone){
        return res.status(401).json({message: "One of parameters is empty"});
    }
    try{
        let user_data = req.body;
        const hash_pass = await bcrypt.hash(user_data.password, Number(process.env.HASH_NUMBER));
        user_data.password = hash_pass;
        const user = await User.create(user_data);

        return res.status(200).json(user);
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
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
            return res.status(401).json({message: "Autentication failed"}); 
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



