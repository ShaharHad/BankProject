require('dotenv').config();

const cors = require('cors')
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const authRoutes = require('./routes/AuthRouter');
const accountRouter = require('./routes/AccountRouter');
const transactionRoutes = require('./routes/TransactionRouter');
const authMiddleware = require('./middleware/AuthMiddleware');




const allowedOrigins = [
    'http://localhost:5001',                  // For local development
    'https://cool-biscotti-36aad2.netlify.app' // Replace with your Netlify URL
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If using cookies or authorization headers
};

app.use(cors(corsOptions));
app.use(express.json()); // middleware for nodejs to parse json !!!
app.use(cookieParser());
// app.use(cors({
//     // origin: 'http://localhost:5001',   // TODO when upload the frontend change it to the new IP/name
//     origin: 'https://cool-biscotti-36aad2.netlify.app/',
//     credentials: true
// }));


app.use('/api/auth', authRoutes);
app.use(authMiddleware);
app.use('/api/account/transaction', transactionRoutes);
app.use('/api/account', accountRouter);

module.exports = app;