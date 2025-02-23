const logger = require("../utils/Logger");
const {createError} = require("../utils/CreateError");
const {getAllMessagesFromAccount, markedMessageAsRead} = require("../db_operations/DBMessageOperation");

exports.setReadMessage = async(req, res, next) => {
    const msg = req.body.msg;
    msg.isRead = true;

    const query = {_id: req.user._id};
    const update = {
        $pull: {"messages.unreadMessages": {_id: msg._id}},
        $push: {"messages.readMessages": {
            $each: [{_id: msg._id, message: msg.message, isRead: true}],
            $position: 0
            }}
    }

    markedMessageAsRead(query, update, {new: true}).then(() => {
        return res.status(200).send({message: "Successfully set the read message field"});
    }).catch((err) => {
        logger.error(err);
        if(err.status !== 400){
            return next(createError(err.status, err.message));
        }
        return next(createError(500, err.message));
    });
}

exports.getAllMessages = async(req, res, next) => {
    try{
        const messages = await getAllMessagesFromAccount({email: req.user.email});

        return res.status(200).send(messages);
    }catch(err){
        logger.error(err.message);
        return next(createError(500, err.message));
    }
}

