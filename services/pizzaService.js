const pizzaRepository = require('../repositories/pizzaRepository');

async function getAllPizzas() {
    return await pizzaRepository.getAll();
}

async function getAllPizzasForApi(filters) {
    return await pizzaRepository.getAllForApi(filters);
}

async function getPizzaById(id) {
    return await pizzaRepository.getById(id);
}

async function addPizza({ name, description, price }) {
    return await pizzaRepository.add({
        name,
        description,
        price: parseFloat(price),
        image: 'default.jpg'
    });
}

async function editPizza(id, { name, description, price }) {
    return await pizzaRepository.update(id, {
        name,
        description,
        price: parseFloat(price)
    });
}

async function deletePizza(id) {
    return await pizzaRepository.remove(id);
}

module.exports = {
    getAllPizzas,
    getAllPizzasForApi,
    getPizzaById,
    addPizza,
    editPizza,
    deletePizza
};