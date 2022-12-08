const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
exports.verifymootp = async(req,res) => {
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
  
  }