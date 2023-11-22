const log = require('../../utils/logger')
const moment = require('moment')
const errorMessages = require('../../utils/error.messages')
const bcrypt = require('bcrypt')
const fs = require('fs')
const utils = require('../../utils/utils')

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const UserModel = require('../../models/User')
const { User } = require('../../models/User')

class FrontController {
    static dashboard = async (req, res) => {
        try {
            log.info('dashboard(): req: %o', utils.reqObject(req, res))

            const allUsersCount = await UserModel.count(
                { role: { $ne: User.getRoleBySlug('super-admin').dbName } }
            )
            // console.log(allUsersCount)

            const responseObject = {
                title: 'Dashboard',
                user: req.decoded,
                allUsersCount,
                successMessage: req.flash('success'),
                errorMessage: req.flash('error')
            }
            res.render('admin/dashboard', responseObject)
        } catch (err) {
            log.error('dashboard(): catch error: %o', err)
        }
    }

    static usersList = async (req, res) => {
        try {
            log.info('usersList(): req.decoded: %o', req.decoded)
            const user = req.decoded
            const data = await UserModel.find(
                { role: { $ne: User.getRoleBySlug('super-admin').dbName } }
            )
            const finalArray = []
            // for (const item of data) {
            for (const [index, value] of data.entries()) {
                const finalObject = {}
                console.log(value, '------------- value')
                finalObject.index = index
                finalObject.id = value._id
                finalObject.name = value.name
                finalObject.email = value.email
                finalObject.role = User.getRoleByDbName(value.role).label
                finalObject.status = User.getStatusByDbName(value.status).label
                finalObject.theme = value.theme
                finalObject.profileImage = value.profile_image
                // finalObject.createdAt = moment(value.createdAt).format('MM/DD/YYYY')
                // finalObject.updatedAt = moment(value.updatedAt).format('MM/DD/YYYY')
                finalObject.createdAt = moment(value.createdAt).format('MM/DD/YYYY HH:mm:ss')
                finalObject.updatedAt = moment(value.updatedAt).format('MM/DD/YYYY HH:mm:ss')
                // finalObject.createdAt = moment(value.createdAt).format('ddd, MMM D YYYY HH:mm a')
                // finalObject.updatedAt = moment(value.updatedAt).format('ddd, MMM D YYYY HH:mm a')

                finalArray.push(finalObject)
            }
            const responseObject = {
                title: 'Users List',
                user,
                data: finalArray,
                successMessage: req.flash('success'),
                errorMessage: req.flash('error')
            }
            console.log(responseObject)
            res.render('admin/users_list', responseObject)
        } catch (error) {
            log.info('usersList(): catch error: %o', error)
        }
    }

    static userCreate = async (req, res) => {
        try {
            log.info('userCreate(): req.body: %o', req.body)
            // console.log(req.files.profile_image)

            const file = req.files.profile_image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'profileImage'
            })
            // console.log(imageUpload)
            fs.unlink(file.tempFilePath, (err) => {
                if (err) {
                    throw err
                }
                console.log('Deleted Successfully!')
            })
            // return true

            const hashPassword = await bcrypt.hash(req.body.password, 10)
            const result = new UserModel({
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                // agree_term: req.body.agree_term,
                role: User.getRoleByDbName(req.body.role).dbName,
                status: User.getStatusByDbName(req.body.status).dbName,
                theme: req.body.theme,
                profile_image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url
                }
            })
            await result.save()
            log.info('registerSubmit(): success: new created id: %d', result.id)
            req.flash('success', 'Registration Successfully, Please Login')
            res.redirect('/admin/users')
        } catch (err) {
            log.error('userCreate(): catch error: %o', err)
            return res.json({
                status: false,
                message: err.message,
                response: err
            })
        }
    }

    static userDelete = async (req, res) => {
        try {
            log.info('userDelete(): req.params: %o', req.params)
            const data = await UserModel.findByIdAndDelete(req.params.id)
            console.log(data)
            if (data) {
                req.flash('success', 'User successfully deleted')
            }
            res.redirect('/admin/users-list')
        } catch (err) {
            log.error('userDelete(): catch error: %o', err)
        }
    }

    static userView = async (req, res) => {
        try {
            log.info('userView(): req.params: %o', req.params)
            // const data = await UserModel.findByIdAndDelete(req.params.id)
            // console.log(data)
            // if (data) {
            //     req.flash('success', 'User successfully deleted')
            // }
            res.redirect('/admin/users-list')
        } catch (err) {
            log.error('userView(): catch error: %o', err)
        }
    }

    static mediaPlayer = async (req, res) => {
        try {
            log.info('mediaPlayer(): req.decoded: %o', req.decoded)
            res.render('admin/media_player')
        } catch (err) {
            log.error('mediaPlayer(): catch error: %o', err)
        }
    }
}

module.exports = FrontController
