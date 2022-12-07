const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");
const validator = require("validator");
const User = require("../model/user");
const router = new express.Router()



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// console.log("============", accountSid, authToken)
const client = require('twilio')(accountSid, authToken);



router.get("/", (req, res) => {
    res.send('first task')
 })
 
 router.post("/register", async (req, res) => {
    try {
       const { first_name, last_name, email, password } = req.body;
 
       if (!(email && first_name && last_name && password)) {
          throw new Error("All input is required");
 
       }
       //  console.log(first_name.trim().length)
       if (!first_name.trim()) {
          throw new Error("First name is required")
       } else if (!/^[a-zA-Z ]*$/.test(first_name)) {
          throw new Error("First name is not valid")
       } else if (!validator.isLength(first_name, { min: 3, max: 25 })) {
          throw new Error("First name should contain 3 to 25 characters.")
       }
 
 
       if (!last_name.trim()) {
          throw new Error("last name is required")
       } else if (!/^[a-zA-Z ]*$/.test(last_name)) {
          throw new Error("last name is not valid")
       } else if (!validator.isLength(last_name, { min: 3, max: 25 })) {
          throw new Error("last name should contain 3 to 25 characters.")
       }
 
 
 
       if (!email.trim()) {
          throw new Error("email is required")
       } else if (!/^[a-z0-9]+(([.+_-]?[a-z0-9]+)+)?@[a-z]{2,5}[.][a-z]{2,4}$/.test(email)) {
          throw new Error("email is not valid")
       } else if (!validator.isLength(last_name, { min: 1, max: 250 })) {
          throw new Error("email should contain 1 to 250 characters.")
       }
 
 
 
 
       const oldUser = await User.findOne({ email });
       //  console.log('olduser....',oldUser)    old user male 
 
       if (oldUser) {
          return res.status(409).send("User is already exitst. Please login");
       }
 
       encryptedPassword = await bcrypt.hash(password, 8);
       //  console.log('password',encryptedPassword)
 
       const user = await User.create({
          first_name,
          last_name,
          email: email.toLowerCase(),
          password: encryptedPassword,
       });
 
       const token = await user.generateAuthToken()
 
       //  const token = jwt.sign({_id: user._id, email },
       //     'jwtproject',
       //  );
 
       //  user.token = token;
 
       res.status(201).json({ user, token });
       console.log('reponse..', { user, token })
    } catch (error) {
       console.log(error)
       res.send({ error: error.message })
    }
 })
 
 
 
 router.post("/login", async (req, res) => {
    try {
       const { email, password } = req.body;
 
       if (!(email && password)) {
          res.status(400).send("All input is required");
       }
       const user = await User.findOne({ email });
 
       // console.log("user..",user)
       // console.log("...", bcrypt.compare(password, user.password))
       // console.log(",,,,,",password)
       // console.log("/////",user.password)
 
 
       if ((user) && (bcrypt.compare(password, user.password))) {
 
          // const token = jwt.sign({_id: user._id, email },
          //    'jwtproject',
          // );
          // user.token = token;
          const token = await user.generateAuthToken()
 
          res.status(200).json({ user, token });
          // console.log('login user..',user)  
       }
       else {
          res.status(400).send("invalid credentials")
       }
    } catch (error) {
       console.log(error);
    }
 
 })
 
 
 
 
 
 
 router.get('/getuser', auth, async (req, res) => {
    try {
       //  const user = await User.findByCredentials(req.body.email, req.body.password)
       //  const token = await user.generateAuthToken()
       res.send(req.user)
    } catch (e) {
 
       console.log('errror..', e)
       res.status(400).send()
    }
 })
 
 router.get('/users/:id', (req, res) => {
    const _id = req.params.id
    //   console.log(req.params)
 
    User.findById(_id).then((user) => {
       if (!user) {
          return res.status(404).send()
       }
       res.send(user)
    }).catch((e) => {
       console.log(e)
       res.status(500).send()
    })
 })
 
 router.delete('/userdelete', auth, async (req, res) => {
    try {
       req.user.remove()
       res.send(req.user)
    } catch (error) {
       console.log('errror......', error)
       //   res.status(500).send(e) 
    }
 
 })
 
 
 router.patch('/changepassword', auth, async (req, res) => {
    const match = await bcrypt.compare(req.body.oldpassword, req.user.password)
    //  console.log('show password old',req.body.oldpassword )
    //  console.log('show password enter',req.user.password )
    if (match) {
       const user = await User.findOneAndUpdate({ _id: req.user._id }, { password: await bcrypt.hash(req.body.newpassword, 8) })
       // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
       console.log('show password new...', req.body.newpassword)
       res.send(user)
 
    }
    else {
       console.log("do not match old and new password please enter right password")
    }
 })
 
 // app.get('/sendotp', async(req, res) => {
 //    try {
 //         const otp = await client.verify.v2.services("VAf038d03215d7bf3bf4bc5a6aea75562a")
 //         .verifications
 //                 .create({to: '+918140747116', channel: 'sms'})
 //          res.status(200).send({otp})
 //    } catch (error) {
 //       console.log('errror......',error)
 //         res.status(500).send({error : error.message}) 
 //    }
 
 // }).
 
 
 router.get('/sendotp', async (req, res) => {
    try {
       const otp = await client.verify.v2.services("VAf038d03215d7bf3bf4bc5a6aea75562a")
          .verifications
          .create({ to: req.body.mobileno, channel: 'sms' })
       console.log("data......", otp)
       res.status(200).send({ otp })
    } catch (error) {
       console.log('errror......', error)
       res.status(500).send({ error: error.message })
    }
 
 })
 
 // app.post('/verifyotp', async(req, res) => {
 //    try {
 //         const otpverify = await client.verify.v2.services("VAf038d03215d7bf3bf4bc5a6aea75562a")
 //         .verificationChecks
 //         .create({to: '+918140747116', code: '5248'})
 
 //       if(otpverify.valid=="true"){
 //           res.send("otp verify sucessfully..")
 //       }else{
 //          res.send("otp invalid")
 //       }
 
 //         res.status(200).send({otpverify})
 
 //    } catch (error) {
 //       console.log('errror......',error)
 
 //       if(error.code=20404){
 //           res.send("otp use in only one time ")
 //       }else{
 //          res.status(500).send({error : error.message}) 
 //       }
 //    } 
 
 // })
 
 router.post('/verifyotp', async (req, res) => {
    try {
       const otpverify = await client.verify.v2.services("VAf038d03215d7bf3bf4bc5a6aea75562a")
          .verificationChecks
          .create({ to: req.body.mobileno, code: req.body.enterotp })
       console.log("verify....", otpverify)
       if (otpverify.valid == true) {
          res.send("otp verify sucessfully..")
       } else {
          res.send("otp invalid")
       }
       //   console.log("sgglfdlk...",req.body.enterotp)
       //   res.status(200).send({otpverify})
 
    } catch (error) {
       console.log('errror......', error)
 
       if (error.code == 20404) {
          res.send("otp use in only one time ")
       } else {
          res.status(500).send({ error: error.message })
       }
    }
 
 })
 
 
 
 
 router.get('/emailsendotp', async (req, res) => {
    try {
 
       const otp = await client.verify.v2.services("VAf038d03215d7bf3bf4bc5a6aea75562a")
          .verifications
          .create({ to: req.body.email, channel: 'email' })
       res.status(200).send({ otp })
 
    } catch (error) {
       console.log('======errror......', error)
       res.status(500).send({ error: error.message })
    }
 
 })
 
 
 
 router.post('/emailverifyotp', async (req, res) => {
    try {
       const otpverify = await client.verify.v2.services("VAf038d03215d7bf3bf4bc5a6aea75562a")
          .verificationChecks
          .create({ to: req.body.email, code: req.body.enterotp })
       console.log("verify....", otpverify)
       if (otpverify.valid == true) {
          // const user = await User.findOneAndUpdate({ _id: req.body.email }, { password: await bcrypt.hash(req.body.newpassword, 8) })
          const user = await User.findOneAndUpdate({ email: req.body.email }, { password: await bcrypt.hash(req.body.newpassword, 8) }, { new: true })
          console.log('newsetpassword', user.password)
          res.status(200).send(user)
 
       } else {
          res.send("otp invalid")
       }
       //   console.log("sgglfdlk...",req.body.enterotp)
       //   res.status(200).send({otpverify})
 
    } catch (error) {
       console.log('errror......', error)
 
       if (error.code == 20404) {
          res.send("otp use in only one time ")
       } else {
          res.status(500).send({ error: error.message })
       }
    }
 
 })

 module.exports =router;