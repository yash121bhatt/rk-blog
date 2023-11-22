const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    agree_term: {
        type: String,
        default: 'off'
    },
    profile_image: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    status: {
        type: String,
        default: 'inactive'
    },
    role: {
        type: String,
        default: 'user'
    },
    theme: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})
const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel

// -------------------------- User Status
const userStatus = [
    { id: 1, slug: 'inactive', dbName: 'inactive', label: 'Inactive' },
    { id: 2, slug: 'active', dbName: 'active', label: 'Active' },
    { id: 3, slug: 'block', dbName: 'block', label: 'Block' }
]
// Shorthand function to get userStatus object by slug
const getStatusBySlug = (slug) => userStatus.find(item => item.slug === slug)
const getStatusByDbName = (dbName) => userStatus.find(item => item.dbName === dbName)

// -------------------------- User Type
const userType = [
    { id: 1, slug: 'super-admin', dbName: 'super_admin', label: 'Super Admin' },
    { id: 2, slug: 'admin', dbName: 'admin', label: 'Admin' },
    { id: 3, slug: 'user', dbName: 'user', label: 'User' },
    { id: 4, slug: 'author', dbName: 'author', label: 'Author' }
]
// Shorthand function to get userType object by slug
const getRoleBySlug = (slug) => userType.find(item => item.slug === slug)
const getRoleByDbName = (dbName) => userType.find(item => item.dbName === dbName)

module.exports.User = {
    getStatusBySlug,
    getStatusByDbName,
    getRoleBySlug,
    getRoleByDbName
}
