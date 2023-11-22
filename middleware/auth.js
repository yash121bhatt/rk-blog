const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')

const checkAuth = async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        req.flash('error', 'Unauthorized User Please Login')
        res.redirect('/')
    } else {
        const verifyToken = jwt.verify(token, process.env.JWT_TOKEN)
        const user = await UserModel.findOne({ _id: verifyToken.ID })
        req.decoded = user
        next()
    }
}
module.exports = checkAuth
