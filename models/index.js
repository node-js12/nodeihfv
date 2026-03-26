const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mssql',
        host: 'localhost',
        dialectModule: require('tedious'),
        logging: false,
        dialectOptions: {
            options: {
                instanceName: 'SQLEXPRESS02',
                encrypt: false,
                trustServerCertificate: true
            }
        }
    }
);

const User = require('./User')(sequelize, DataTypes);
const Pizza = require('./Pizza')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const OrderItem = require('./OrderItem')(sequelize, DataTypes);

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Pizza.hasMany(OrderItem, { foreignKey: 'pizzaId' });
OrderItem.belongsTo(Pizza, { foreignKey: 'pizzaId' });

module.exports = {
    sequelize,
    User,
    Pizza,
    Order,
    OrderItem
};