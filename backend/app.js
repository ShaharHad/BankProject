require('dotenv').config();

const cors = require('cors')
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const authRoutes = require('./routes/AuthRouter');
const userRoutes = require('./routes/UserRouter');
const transactionRoutes = require('./routes/TransactionRouter');
const authMiddleware = require('./middleware/AuthMiddleware');


app.use(express.json()); // middleware for nodejs to parse json !!!
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4500', // TODO when upload the frontend change it to the new IP/name
    credentials: true
}));


app.use('/auth', authRoutes);
app.use(authMiddleware);
app.use('/user/transaction', transactionRoutes);
app.use('/user', userRoutes);

module.exports = app;