const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");
const path = require("path")
const validator = require("validator");
const User = require("../model/user");
const { userregister } = require('../controller/routers/register');
const { userlogin } = require('../controller/routers/login');
const { getuser } = require('../controller/routers/getuser');
const { getuserbyid } = require('../controller/getuserbyid');
const { deleteuser } = require('../controller/routers/deleteuser');
const { changepassword } = require('../controller/routers/changepassword');
const { sendmootp } = require('../controller/routers/sendmootp');
const { verifymootp } = require('../controller/routers/verifymootp');
const { sendmailotp } = require('../controller/routers/sendemailotp');
const { verifymailotp } = require('../controller/routers/verifyemailotp');
const router = new express.Router()
const htmlfilepath = path.join(__dirname, '../index.html')


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// console.log("============", accountSid, authToken)
const client = require('twilio')(accountSid, authToken);



router.get("/", (req, res) => {
   res.sendFile(htmlfilepath);   
 })
 
 router.post("/register", userregister) 
 router.post("/login", userlogin)
 router.get('/getuser', getuser)
 router.get('/users/:id', getuserbyid) 
 router.delete('/userdelete',deleteuser)
 router.patch('/changepassword', changepassword) 
 router.get('/sendotp', sendmootp)
 router.post('/verifyotp', verifymootp) 
 router.get('/emailsendotp', sendmailotp)
 router.post('/emailverifyotp', verifymailotp)
    

 module.exports =router;