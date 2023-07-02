const express = require('express');
const multer = require('multer');

const auth = require('../auth.js')
const productsControllers = require('../controllers/productsControllers.js');
const upload = multer({ dest: 'uploads/', encoding: 'binary',limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

// products Routes
router.post('/add', auth.verify, upload.array('files'), productsControllers.addProduct);
router.get('/all', auth.verify, productsControllers.getAllProducts);
router.get('/active', productsControllers.getActiveProducts);
router.get('/bundles/active', productsControllers.getActiveBundles);
router.get('/categories', productsControllers.getCategories);

// products/:productId Routes
router.get('/:productId', productsControllers.getProduct);
router.patch('/:productId', auth.verify, upload.array('files'),  productsControllers.updateProduct)
router.patch('/:productId/archive', auth.verify, productsControllers.archiveProduct)
router.patch('/:productId/activate', auth.verify, productsControllers.activateProduct)
router.post('/:productId/addToCart', auth.verify, productsControllers.addToCart);

module.exports = router;