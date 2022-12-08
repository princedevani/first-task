exports.sendmailotp = async(req,res) => {
    try {
 
        const otp = await client.verify.v2.services("VAf038d03215d7bf3bf4bc5a6aea75562a")
           .verifications
           .create({ to: req.body.email, channel: 'email' })
        res.status(200).send({ otp })
  
     } catch (error) {
        console.log('======errror......', error)
        res.status(500).send({ error: error.message })
     }
  
  }