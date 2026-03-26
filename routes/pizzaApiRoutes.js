const express = require('express');
const router = express.Router();
const pizzaService = require('../services/pizzaService');

router.get('/pizzas', async (req, res) => {
    try {
        const result = await pizzaService.getAllPizzasForApi(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні списку піц' });
    }
});

router.get('/pizzas/:id', async (req, res) => {
    try {
        const pizza = await pizzaService.getPizzaById(req.params.id);

        if (!pizza) {
            return res.status(404).json({ error: 'Піцу не знайдено' });
        }

        res.status(200).json(pizza);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при отриманні піци' });
    }
});

router.post('/pizzas', async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !description || price === undefined) {
            return res.status(400).json({ error: 'Не всі поля заповнені' });
        }

        const newPizza = await pizzaService.addPizza({ name, description, price });
        res.status(201).json(newPizza);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при створенні піци' });
    }
});

router.put('/pizzas/:id', async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !description || price === undefined) {
            return res.status(400).json({ error: 'Не всі поля заповнені' });
        }

        const updatedPizza = await pizzaService.editPizza(req.params.id, {
            name,
            description,
            price
        });

        if (!updatedPizza) {
            return res.status(404).json({ error: 'Піцу не знайдено' });
        }

        res.status(200).json(updatedPizza);
    } catch (error) {
        res.status(500).json({ error: 'Помилка при оновленні піци' });
    }
});

router.delete('/pizzas/:id', async (req, res) => {
    try {
        const deleted = await pizzaService.deletePizza(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Піцу не знайдено' });
        }

        res.status(200).json({ message: 'Піцу видалено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка при видаленні піци' });
    }
});

module.exports = router;