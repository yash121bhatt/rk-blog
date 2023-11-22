const express = require('express')
// const checkAuth = require('../middleware/auth')
// const FrontController = require('../controllers/FrontController')

const router = express.Router()

router.get('/', (req, res) => {
    const today = new Date().toString()
    const str = '****' + today
    res.send(str)
})

module.exports = router
