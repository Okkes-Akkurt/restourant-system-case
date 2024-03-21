const Restaurant = require('../models/restaurantModel.js');

const getAllRestaurants = async (req, res) => {
	try {
		const restaurants = await Restaurant.find();
		res.status(200).json(restaurants);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const createRestaurant = async (req, res) => {
	try {
		const { name, description, logo, location, address, types, branches, menu, commentsAndRating } = req.body;
		const restaurant = new Restaurant({
			name,
			description,
			logo,
			location,
			address,
			types,
			branches,
			menu,
			commentsAndRating,
		});
		await restaurant.save();
		res.status(201).json({ message: 'Created restaurant successfully.' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getRestaurantDetails = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id);
		if (!restaurant) {
			return res.status(404).json({ message: 'Can not find Restaurant.' });
		}
		res.status(200).json(restaurant);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};



/*

const menuItems = [
			{ name: 'Küçük boy peynirli pizza', price: 50 },
			{ name: 'Orta boy mantarlı pizza', price: 100 },
			{ name: 'Hamburger', price: 120 },
		];

*/

const addMenuItems = async (req, res) => {
	try {

        const { name, price } = req.body;
		const restaurant = await Restaurant.findOne({ name: 'Voco Fast Food' });

		if (!restaurant) {
			throw new Error('Can not find restaurant');
		}

        const menuItems = { name, price };

		for (const menuItem of menuItems) {
			const newMenuItem = await Menu.create(menuItem);
			restaurant.menu.push(newMenuItem);
		}

		await restaurant.save();

		res.send('Menu is added successfully');
	} catch (error) {
		console.error('Hata:', error);
		res.status(500).json({ error: error.message || 'Internal server error' });
	}
};


module.exports = { getAllRestaurants, createRestaurant, addMenuItems, getRestaurantDetails };