require("dotenv").config();
const express = require('express');
const { sequelize } = require('./models');
const path = require('path');
const session = require('express-session');
const pizzaRoutes = require('./routes/pizzaRoutes');
const pizzaApiRoutes = require('./routes/pizzaApiRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.currentPath = req.path;
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pizzaRoutes);
app.use('/api', pizzaApiRoutes);

app.use((req, res) => {
    res.status(404).send('Сторінка не знайдена 😕');
});

sequelize.authenticate()
    .then(() => console.log('Sequelize connected to SQL Server'))
    .catch(err => console.error('Sequelize connection error:', err));

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});