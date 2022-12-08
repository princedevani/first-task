require('dotenv').config();
const path = require('path')
const jwt = require('jsonwebtoken');



const userRouter = require('./router/user')


require("./database").connect();



// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// console.log("============", accountSid, authToken)
// const client = require('twilio')(accountSid, authToken);

const express = require('express');




const app = express();

// const htmlfilepath = path.join(__dirname, './index.html')
// app.use(express.static(htmlfilepath))


app.use(express.json());




app.use(userRouter)


module.exports = app;