const { Order, OrderItem, Pizza, sequelize } = require('../models');

async function getAll() {
    return await Order.findAll({
        include: [
            {
                model: OrderItem,
                include: [Pizza]
            }
        ],
        order: [['createdAt', 'DESC']]
    });
}

async function createOrder(userId, cart, transaction) {
    const order = await Order.create(
        {
            userId: userId,
            status: 'Нове',
            createdAt: sequelize.literal('GETDATE()')
        },
        { transaction }
    );

    for (const item of cart) {
        const pizzaId = item.pizzaId || item.id;
        const quantity = item.quantity || 1;

        let price = item.price;

        if (price == null) {
            const pizza = await Pizza.findByPk(pizzaId, { transaction });

            if (!pizza) {
                throw new Error(`Піцу з id=${pizzaId} не знайдено`);
            }

            price = pizza.price;
        }

        await OrderItem.create(
            {
                orderId: order.id,
                pizzaId: pizzaId,
                quantity: quantity,
                price: price
            },
            { transaction }
        );
    }

    return order.id;
}

async function updateStatus(id, status) {
    const order = await Order.findByPk(id);

    if (!order) {
        throw new Error('Замовлення не знайдено');
    }

    order.status = status;
    await order.save();

    return order;
}

module.exports = {
    getAll,
    createOrder,
    updateStatus
};