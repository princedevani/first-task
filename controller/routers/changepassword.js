
exports.changepassword = async(req,res) => {
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
}