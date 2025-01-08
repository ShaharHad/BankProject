require('dotenv').config();
const morgan = require("morgan");
const cors = require('cors')
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const authRoutes = require('./routes/AuthRouter');
const accountRouter = require('./routes/AccountRouter');
const transactionRoutes = require('./routes/TransactionRouter');
const authMiddleware = require('./middleware/AuthMiddleware');
const logger = require('./utils/Logger');



const middlewareMorgan = morgan(
    ":method :url :status :response-time ms",
    {
        write: (message) => logger.http(message.trim()),
});

const allowedOrigins = [
    'http://localhost:5001',
    'https://cool-biscotti-36aad2.netlify.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true); // allow to process the request
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // for using cookies or authorization headers
};

app.use(cors(corsOptions));
app.use(express.json()); // middleware for nodejs to parse json !!!
app.use(cookieParser());
app.use(middlewareMorgan);


app.use('/api/auth', authRoutes);
app.use(authMiddleware);
app.use('/api/account/transaction', transactionRoutes);
app.use('/api/account', accountRouter);

module.exports = app;