const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const web = require('./routes/web')
const api = require('./routes/api')
const log = require('./utils/logger')
require('dotenv').config()

const app = express()

const port = process.env.PORT || 8000

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions',
    autoRemove: 'interval',
    autoRemoveInterval: 10
}, function (err) {
    if (err) {
        log.error('Error connecting to MongoStore:', err)
    } else {
        log.info('Connected to MongoStore')
    }
})

app.use(express.static('public'))
app.use('/admin_lte_v3', express.static('admin_lte_v3'))
app.use('/cool_admin', express.static('cool_admin'))
app.use('/dev_blog_v1.1', express.static('dev_blog_v1.1'))
app.use('/login_register', express.static('login_register'))

app.use(cookieParser())
app.use(session({
    secret: process.env.MONGO_DB_URL || 'default-secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}))
app.use(fileUpload({ useTempFiles: true }))

app.use(express.urlencoded({ extended: true }))

app.use('/', web)
app.use('/api', api)

app.get('**', (req, res) => {
    res.status(404).send('<h1>Page Not Found</h1>')
})

app.use((err, req, res, next) => {
    log.error(err.stack)
    res.status(500).send('Something went wrong!')
})

app.listen(port, () => {
    log.info(`App is running on http://localhost:${port}`)
})
