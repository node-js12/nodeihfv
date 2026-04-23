const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizzaController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'public', 'images');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `pizza-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Можна завантажувати лише зображення'));
    }
};

const upload = multer({ storage, fileFilter });

router.get('/', pizzaController.getMenuPage);

router.get('/login', pizzaController.getLoginPage);
router.post('/login', pizzaController.postLogin);

router.get('/register', pizzaController.getRegisterPage);
router.post('/register', pizzaController.postRegister);

router.get('/cart', pizzaController.getCartPage);
router.post('/cart/add/:id', pizzaController.addToCart);
router.post('/cart/update/:id', pizzaController.updateCartQuantity);
router.post('/cart/remove/:id', pizzaController.removeFromCart);
router.post('/cart/checkout', pizzaController.checkoutCart);

router.get('/admin', pizzaController.getAdminPage);
router.post('/admin/add', upload.single('image'), pizzaController.addPizza);
router.post('/admin/edit/:id', upload.single('image'), pizzaController.editPizza);
router.post('/admin/delete/:id', pizzaController.deletePizza);
router.post('/admin/process/:orderId', pizzaController.processOrder);

router.get('/logout', pizzaController.logout);

module.exports = router;