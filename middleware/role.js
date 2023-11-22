const errorMessages = require('../utils/error.messages')
const log = require('../utils/logger')

module.exports.hasRole = (roles = []) => {
    return function (req, res, next) {
        if (roles.includes(req.decoded.role)) {
            next()
        } else {
            // return res.status(401).json({
            //     success: false,
            //     message: 'Unauthorized Error',
            //     response: {
            //         status: null
            //     }
            // })
            log.error('hasRole(): error: %s', errorMessages.ACCESS_DENIED)
            req.flash('error', errorMessages.ACCESS_DENIED)
            res.redirect('back')
        }
    }
}
