const { Order, OrderItem, Pizza, User, sequelize } = require('../models');

async function getAll() {
    const orders = await Order.findAll({
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: OrderItem,
                include: [
                    {
                        model: Pizza,
                        attributes: ['name']
                    }
                ]
            }
        ],
        order: [['id', 'DESC']]
    });

    return orders.map(order => ({
        id: order.id,
        userId: order.userId,
        user: order.User ? order.User.username : '',
        status: order.status,
        createdAt: order.createdAt,
        items: order.OrderItems.map(item => ({
            id: item.id,
            orderId: item.orderId,
            pizzaId: item.pizzaId,
            quantity: item.quantity,
            price: item.price,
            name: item.Pizza ? item.Pizza.name : ''
        }))
    }));
}

async function createOrder(userId, cart, createdAt, transaction) {
    const order = await Order.create({
        userId,
        status: 'Нове',
        createdAt
    }, { transaction });

    for (const item of cart) {
        await OrderItem.create({
            orderId: order.id,
            pizzaId: item.id,
            quantity: item.quantity || 1,
            price: item.price
        }, { transaction });
    }

    return order.id;
}

async function updateStatus(id, status) {
    const transaction = await sequelize.transaction();

    try {
        const [updatedRows] = await Order.update(
            { status },
            {
                where: { id },
                transaction
            }
        );

        await transaction.commit();
        return updatedRows > 0;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    getAll,
    createOrder,
    updateStatus
};