const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required!"]
    },
    description: {
        type: String,
        required: [true, "Product description is required!"]
    },
    category: {
        type: String
    },
    imgFiles: [
        {
            fileName: {
                type: String,
                required: true
            },
            googleDriveLink: {
                type: String,
                required: true
            }
        }
    ],
    price: {
        type: Number,
        required: [true, "Price is required!"]
    },
    isBundle: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
})

const Products = mongoose.model('Products', productSchema)

module.exports = Products;