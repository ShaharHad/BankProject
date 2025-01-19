const {google} = require('googleapis');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const logger = require('../utils/Logger');


require("dotenv").config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri=process.env.REDIRECT_URI;
const email_sender = process.env.EMAIL_SENDER;
const refresh_token = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uri
);

oauth2Client.setCredentials({refresh_token: refresh_token});

exports.sendActivationLink = async(email) => {

   try{

       const accessToken = await oauth2Client.getAccessToken();

       const transporter = nodemailer.createTransport({
           service: process.env.EMAIL_SERVICE,
           auth: {
               type: 'OAuth2',
               user: email_sender,
               clientId: client_id,
               clientSecret: client_secret,
               refreshToken: refresh_token,
               accessToken: accessToken.token,
           },
       });

       const token = jwt.sign({email: email}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
       const activationLink = `${process.env.APP_URL}/api/auth/activateAccount/?token=${token}`;

       transporter.sendMail({
           from: process.env.EMAIL_SERVICE,
           to: email,
           subject: 'Account Activation',
           html: `<p>Welcome, ${email}!</p>
            <p>Click the link below to activate your account:</p>
            <a href="${activationLink}">Activate Account</a>`,

       });
   }
   catch(e){
       logger.error(e.message);
       throw e;
   }
}

