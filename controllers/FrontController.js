const log = require('../utils/logger')
const utils = require('../utils/utils')
class FrontController {
    static home = (req, res) => {
        try {
            log.info('home(): req: %o', utils.reqObject(req, res))
            const responseObject = {
                title: 'Home',
                user: req.decoded
            }
            res.render('home', responseObject)
        } catch (err) {
            log.error('home(): catch error: %o', err)
        }
    }

    static about = (req, res) => {
        try {
            log.info('about(): req: %o', utils.reqObject(req, res))
            const responseObject = {
                title: 'About'
            }
            res.render('about', responseObject)
        } catch (err) {
            log.error('about(): catch error: %o', err)
        }
    }

    static contact = (req, res) => {
        try {
            log.info('contact(): req: %o', utils.reqObject(req, res))
            const responseObject = {
                title: 'About'
            }
            res.render('contact', responseObject)
        } catch (err) {
            log.error('contact(): catch error: %o', err)
        }
    }
}

module.exports = FrontController
