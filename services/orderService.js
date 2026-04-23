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

    let transaction = null;

    try {
        transaction = await sequelize.transaction();

        const orderId = await orderRepository.createOrder(
            user.id,
            cart,
            transaction
        );

        await transaction.commit();
        return orderId;
    } catch (error) {
        console.error('SPRAVZHNYA POMYLKA CREATE ORDER:', error.message);

        try {
            if (transaction && !transaction.finished) {
                await transaction.rollback();
            }
        } catch (rollbackError) {
            console.error('POMYLKA ROLLBACK:', rollbackError.message);
        }

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