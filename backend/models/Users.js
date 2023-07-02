const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required!"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"]
    },
    password: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isSubscriber: {
        type: Boolean,
        default: false
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products'
            },

            quantity: {
                type: Number,
                required: [true, "Product qty in cart items is required"]
            }
        }
    ],
    profilePhoto: {
        fileName: {
            type: String,
            required: true
        },
        googleDriveLink: {
            type: String,
            required: true
        }
    }
})

const Users = mongoose.model("Users", usersSchema)

module.exports = Users;