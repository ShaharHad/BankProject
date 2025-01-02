const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendActivationLink = async(email) => {

        const token = jwt.sign({email: email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
        const activationLink = `${process.env.APP_URL}/activateAccount/${token}`;

        transporter.sendMail({
            from: process.env.EMAIL_SERVICE,
            to: email,
            subject: 'Account Activation',
            html: `<p>Welcome, ${email}!</p>
                <p>Click the link below to activate your account:</p>
                <a href="${activationLink}">Activate Account</a>`,

        });
}

