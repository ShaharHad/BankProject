require('dotenv').config();

const cors = require('cors')
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const authRoutes = require('./routes/AuthRouter');
const userRoutes = require('./routes/UserRouter');
const transactionRoutes = require('./routes/TransactionRouter');
const authMiddleware = require('./middleware/AuthMiddleware');

app.use(express.json()); // middleware for nodejs to parse json !!!

app.use(cors({
    origin: 'http://localhost:4500', // TODO when upload the frontend change it to the new IP/name
    credentials: true
}));

app.use('/auth', authRoutes);
app.use(authMiddleware);
app.use('/user/transaction', transactionRoutes);
app.use('/user', userRoutes);


const db_connection = process.env.DB_CONNECTION;
mongoose.connect(db_connection).then(() => {
    console.log("Connected to DB");
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});




