
exports.deleteuser = async(req,res) => {
  try {
    req.user.remove()
    res.send(req.user)
 } catch (error) {
    console.log('errror......', error)
    //   res.status(500).send(e) 
 }

}