const pizzaService = require('../services/pizzaService');
const userService = require('../services/userService');
const orderService = require('../services/orderService');

exports.getMenuPage = async (req, res) => {
    const pizzas = await pizzaService.getAllPizzas();

    res.render('index', {
        pizzas,
        isLoggedIn: !!req.session.user,
        role: req.session.user?.role || null
    });
};

exports.getLoginPage = (req, res) => {
    res.render('login', { error: null });
};

exports.getRegisterPage = (req, res) => {
    res.render('register', { error: null });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await userService.login(username, password);

    if (!user) {
        return res.render('login', { error: 'Невірний логін або пароль' });
    }

    req.session.user = {
        username: user.username,
        role: user.role
    };

    res.redirect(user.role === 'admin' ? '/admin' : '/');
};

exports.postRegister = async (req, res) => {
    const { username, email, password } = req.body;

    const result = await userService.register({ username, email, password });

    if (result.error) {
        return res.render('register', { error: result.error });
    }

    req.session.user = {
        username: result.user.username,
        role: result.user.role
    };

    res.redirect('/');
};

exports.getCartPage = (req, res) => {
    const cart = req.session.cart || [];
    const error = req.query.error ? decodeURIComponent(req.query.error) : null;
    const success = req.query.success ? true : false;

    res.render('cart', { cart, error, success });
};

exports.addToCart = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const pizzaId = parseInt(req.params.id);
    const pizza = await pizzaService.getPizzaById(pizzaId);

    if (!pizza) {
        return res.redirect('/');
    }

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const existing = req.session.cart.find(item => item.id === pizzaId);

    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        req.session.cart.push({ ...pizza, quantity: 1 });
    }

    res.redirect('/cart');
};

exports.updateCartQuantity = (req, res) => {
    const pizzaId = parseInt(req.params.id);
    const action = req.body.action;

    if (!req.session.cart) {
        return res.redirect('/cart');
    }

    const item = req.session.cart.find(p => p.id === pizzaId);

    if (!item) {
        return res.redirect('/cart');
    }

    if (action === 'increase') {
        item.quantity = (item.quantity || 1) + 1;
    }

    if (action === 'decrease') {
        item.quantity = (item.quantity || 1) - 1;

        if (item.quantity <= 0) {
            req.session.cart = req.session.cart.filter(p => p.id !== pizzaId);
        }
    }

    res.redirect('/cart');
};

exports.removeFromCart = (req, res) => {
    const pizzaId = parseInt(req.params.id);

    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(p => p.id !== pizzaId);
    }

    res.redirect('/cart');
};

exports.checkoutCart = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/cart?error=' + encodeURIComponent('Для оформлення потрібно увійти в акаунт'));
    }

    const cart = req.session.cart || [];

    if (cart.length === 0) {
        return res.redirect('/cart?error=' + encodeURIComponent('Кошик порожній'));
    }

    await orderService.createOrder(req.session.user.username, cart);

    req.session.cart = [];
    res.redirect('/cart?success=1');
};

exports.getAdminPage = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login');
    }

    const pizzas = await pizzaService.getAllPizzas();
    const orders = await orderService.getAllOrders();

    res.render('admin', { pizzas, orders });
};

exports.addPizza = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login');
    }

    try {
        const { name, description, price } = req.body;
        const image = req.file ? req.file.filename : 'default.jpg';

        await pizzaService.addPizza({ name, description, price, image });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Помилка при додаванні піци');
    }
};

exports.editPizza = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login');
    }

    try {
        const id = parseInt(req.params.id);
        const { name, description, price } = req.body;
        const image = req.file ? req.file.filename : null;

        await pizzaService.editPizza(id, { name, description, price, image });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Помилка при редагуванні піци');
    }
};

exports.deletePizza = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login');
    }

    const id = parseInt(req.params.id);
    await pizzaService.deletePizza(id);

    res.redirect('/admin');
};

exports.processOrder = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login');
    }

    const orderId = parseInt(req.params.orderId);
    await orderService.processOrder(orderId);

    res.redirect('/admin');
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};