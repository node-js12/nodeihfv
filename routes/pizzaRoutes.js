const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizzaController');

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
router.post('/admin/add', pizzaController.addPizza);
router.post('/admin/edit/:id', pizzaController.editPizza);
router.post('/admin/delete/:id', pizzaController.deletePizza);
router.post('/admin/process/:orderId', pizzaController.processOrder);

router.get('/logout', pizzaController.logout);

module.exports = router;