const express = require('express');

const auth = require('../auth.js')
const ordersControllers = require('../controllers/ordersControllers.js');

const router = express.Router();

// orders Routes
router.get('/', [auth.verify, ordersControllers.getOrders]);
router.get('/all', [auth.verify, ordersControllers.getAllOrders]);
router.post('/checkout', [auth.verify, ordersControllers.checkOut]);

module.exports = router;