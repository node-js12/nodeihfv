const userRepository = require('../repositories/userRepository');

async function login(username, password) {
    return await userRepository.findByCredentials(username, password);
}

async function register({ username, email, password }) {
    const existingUser = await userRepository.findByUsername(username);

    if (existingUser) {
        return { error: 'Користувач з таким логіном вже існує' };
    }

    const createdUser = await userRepository.add({
        username,
        email,
        password,
        role: 'user'
    });

    return { user: createdUser };
}

module.exports = {
    login,
    register
};