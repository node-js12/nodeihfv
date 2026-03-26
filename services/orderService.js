const moment = require('moment');
const { sequelize } = require('../models');
const orderRepository = require('../repositories/orderRepository');
const userRepository = require('../repositories/userRepository');

async function getAllOrders() {
    return await orderRepository.getAll();
}

async function createOrder(username, cart) {
    const user = await userRepository.findByUsername(username);

    if (!user) {
        throw new Error('Користувача не знайдено');
    }

    const transaction = await sequelize.transaction();

    try {
        const createdAt = moment().toDate();

        const orderId = await orderRepository.createOrder(
            user.id,
            cart,
            createdAt,
            transaction
        );

        await transaction.commit();
        return orderId;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function processOrder(id) {
    return await orderRepository.updateStatus(id, 'Оброблено');
}

module.exports = {
    getAllOrders,
    createOrder,
    processOrder
};