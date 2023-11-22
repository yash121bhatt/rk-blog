const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')

const loggedUsers = async (req, res, next) => {
    const { token } = req.cookies
    if (token) {
        const verifyToken = jwt.verify(token, process.env.JWT_TOKEN)
        const user = await UserModel.findOne({ _id: verifyToken.ID })
        req.decoded = user
        if (req.decoded && (req.decoded.role == 'super_admin' || req.decoded.role == 'admin')) {
            return res.redirect('/admin/dashboard')
        } else if (req.decoded && (req.decoded.role == 'user' || req.decoded.role == 'author')) {
            return res.redirect('/home')
        }
    }
    next()
}
module.exports = loggedUsers
