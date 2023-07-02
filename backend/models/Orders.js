const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    products:[{
        productID : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        quantity : {
            type: String,
            required: [true, "Product qty in cart items is required"]
        },
        price : {
            type: String,
            required: [true, "Product qty in cart items is required"]
        },
        subtotal : {
            type: Number,
            required: [true, "Subtotal of product in cart items  is required!"]
        },
    }],
    totalAmount : {
        type: Number,
        required: [true, "Total Amount is required!"]
    },
    purchasedOn : {
        type: Date,
        default: new Date()
    }
})

const Orders = mongoose.model("Orders", orderSchema);

module.exports = Orders;