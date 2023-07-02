const express = require('express');

const auth = require('../auth.js')
const usersControllers = require('../controllers/usersControllers.js');

const router = express.Router();

// users Routes
router.post('/register', usersControllers.registerUser);
router.post('/login', usersControllers.loginUser);
router.get('/userDetails', [auth.verify, usersControllers.getUserDetails]);
router.get('/profile', [auth.verify, usersControllers.getProfile]);
router.patch('/makeAdmin', [auth.verify, usersControllers.makeAdmin]);
router.patch('/removeAdmin', [auth.verify, usersControllers.removeAdmin]);

// users/cart Routes
router.get('/cart', [auth.verify, usersControllers.viewCartItems])
router.delete('/cart/removeItem', [auth.verify, usersControllers.removeCartItem]);
router.patch('/cart/updateQty', [auth.verify, usersControllers.changeCartItemQty]);
router.get('/cart/itemSubtotals', [auth.verify, usersControllers.cartSubtotals])
router.get('/cart/total', [auth.verify, usersControllers.cartTotal])

module.exports = router;