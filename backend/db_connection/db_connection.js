const mongoose = require('mongoose');
const logger = require('../utils/Logger');

const db_connection = process.env.DB_CONNECTION;

mongoose.connect(db_connection).then(() => {
    logger.info("Connected to DB");
}).catch((err) => {
    logger.error(err);
});

module.exports = mongoose.connection;