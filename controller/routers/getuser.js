
exports.getuser = async(req,res) => {

 try {
    //  const user = await User.findByCredentials(req.body.email, req.body.password)
    //  const token = await user.generateAuthToken()
    res.send(req.user)
 } catch (e) {

    console.log('errror..', e)
    res.status(400).send()
 }
}