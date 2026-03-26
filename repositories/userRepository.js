const { User } = require('../models');

async function findByUsername(username) {
    return await User.findOne({
        where: { username },
        raw: true
    });
}

async function findByCredentials(username, password) {
    return await User.findOne({
        where: { username, password },
        raw: true
    });
}

async function add(user) {
    const created = await User.create({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role
    });

    return created.get({ plain: true });
}

module.exports = {
    findByUsername,
    findByCredentials,
    add
};