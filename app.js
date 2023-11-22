const express = require('express')
require('dotenv').config()
const moment = require('moment')
const app = express()
const log = require('./utils/logger')
const session = require('express-session')
const connectDB = require('./db/connect_db')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const fileUpload = require('express-fileupload')
const web = require('./routes/web')
const api = require('./routes/api')

const port = process.env.PORT || 8000

// View Engine
app.set('view engine', 'EJS')

// Helper function to make environment variables accessible in EJS files
app.locals.env = process.env
app.locals.moment = moment

// connect mongodb
connectDB()

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}))
app.use(flash())

// insert CSS, JS and images
app.use(express.static('public'))
app.use('/admin_lte_v3', express.static('admin_lte_v3'))
app.use('/cool_admin', express.static('cool_admin'))
app.use('/dev_blog_v1.1', express.static('dev_blog_v1.1'))
app.use('/login_register', express.static('login_register'))

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

// for file upload
app.use(fileUpload({ useTempFiles: true }))

// Router load
app.use('/', web)
app.use('/api', api)

app.get('**', (req, res) => {
    res.send('<h1>Page Not Found</h1>')
})

app.listen(port, () => {
    log.info('App is running in port', port)
    log.info(`http://localhost:${port}`)
})
