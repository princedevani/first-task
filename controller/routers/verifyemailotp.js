exports.verifymailotp = async(req,res) => {
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
  
  }