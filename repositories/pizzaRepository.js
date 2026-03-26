const { Pizza, sequelize } = require('../models');
const { Op } = require('sequelize');

async function getAll() {
    return await Pizza.findAll({
        order: [['id', 'ASC']],
        raw: true
    });
}

async function getAllForApi(filters = {}) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 5;
    const offset = (page - 1) * limit;

    const where = {};

    if (filters.search) {
        where.name = {
            [Op.like]: `%${filters.search}%`
        };
    }

    if (filters.minPrice || filters.maxPrice) {
        where.price = {};

        if (filters.minPrice) {
            where.price[Op.gte] = parseFloat(filters.minPrice);
        }

        if (filters.maxPrice) {
            where.price[Op.lte] = parseFloat(filters.maxPrice);
        }
    }

    const { count, rows } = await Pizza.findAndCountAll({
        where,
        order: [['id', 'ASC']],
        limit,
        offset,
        raw: true
    });

    return {
        data: rows,
        pagination: {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            pageSize: limit
        }
    };
}

async function getById(id) {
    return await Pizza.findByPk(id, { raw: true });
}

async function add(pizza) {
    const transaction = await sequelize.transaction();

    try {
        const created = await Pizza.create({
            name: pizza.name,
            description: pizza.description,
            price: pizza.price,
            image: pizza.image
        }, { transaction });

        await transaction.commit();
        return created.get({ plain: true });
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function update(id, updatedFields) {
    const transaction = await sequelize.transaction();

    try {
        const pizza = await Pizza.findByPk(id, { transaction });

        if (!pizza) {
            await transaction.rollback();
            return null;
        }

        await pizza.update({
            name: updatedFields.name,
            description: updatedFields.description,
            price: updatedFields.price
        }, { transaction });

        await transaction.commit();
        return pizza.get({ plain: true });
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function remove(id) {
    const transaction = await sequelize.transaction();

    try {
        const deleted = await Pizza.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
        return deleted > 0;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    getAll,
    getAllForApi,
    getById,
    add,
    update,
    remove
};