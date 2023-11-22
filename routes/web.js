const express = require('express')
const loggedUsers = require('../middleware/loggedUsers')
const FrontController = require('../controllers/FrontController')
const AdminController = require('../controllers/admin/AdminController')
const AuthController = require('../controllers/AuthController')

// Middleware
const checkAuth = require('../middleware/auth')
const { hasRole } = require('../middleware/role')

const router = express.Router()

// router.get('/', async (req, res) => {
//     console.log('req.params:', req.params)
//     console.log('req.query:', req.query)
//     console.log('req.body:', req.body) // Assuming body-parser middleware is used
//     console.log('req.headers:', req.headers)
//     console.log('req.cookies:', req.cookies)
//     console.log('req.method:', req.method)
//     console.log('req.path:', req.path)
//     console.log('req.url:', req.url)
//     console.log('req.hostname:', req.hostname)

//     // console.log(req)
//     // res.send(req.session)
//     // req.flash('error', {
//     //     name: 'Rohit'
//     // })
//     // res.redirect('/register')
// })

router.get('/', [loggedUsers], AuthController.login)
router.get('/register', [loggedUsers], AuthController.register)
router.post('/login', AuthController.loginSubmit)
router.post('/register', AuthController.registerSubmit)

router.get('/logout', [checkAuth], AuthController.logout)

router.get('/admin/:code/create', AuthController.createSuperAdmin) // --------> Create Super Admin

router.get('/home', [checkAuth, hasRole(['user'])], FrontController.home)
router.get('/setting/change-theme/:theme', [checkAuth, hasRole(['admin', 'user'])], AuthController.changeTheme)

router.get('/admin/dashboard', [checkAuth, hasRole(['super_admin', 'admin'])], AdminController.dashboard)
router.get('/admin/users', [checkAuth, hasRole(['super_admin', 'admin'])], AdminController.usersList)
router.get('/admin/user/:id/view', [checkAuth, hasRole(['super_admin', 'admin'])], AdminController.userView)
router.get('/admin/user/:id/delete', [checkAuth, hasRole(['super_admin', 'admin'])], AdminController.userDelete)
router.post('/admin/user', [checkAuth, hasRole(['super_admin', 'admin'])], AdminController.userCreate)

router.get('/admin/media-player', [checkAuth, hasRole(['super_admin', 'admin'])], AdminController.mediaPlayer)

module.exports = router
