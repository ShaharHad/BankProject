const mongoose = require('mongoose');

const db_connection = process.env.DB_CONNECTION;

mongoose.connect(db_connection).then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.error(err);
    console.log("Failed to connect to DB");
});

module.exports = mongoose.connection;