const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db.js');
const Restaurant = require('./models/restaurantModel.js');
const userRoutes = require('./routes/userRoutes.js');
const restaurantRoutes = require('./routes/restaurantRoutes.js');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);



const getRestaurants = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;

	try {
		const restaurants = await Restaurant.find()
			.skip((page - 1) * limit)
			.limit(limit);

		res.json(restaurants);
	} catch (error) {
		console.error('Cannot find the restaurant:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const getRestaurantsSortedByAverageRating = async (req, res) => {
	try {
		const sortedRestaurants = await Restaurant.aggregate([
			{
				$project: {
					name: 1,
					categories: 1,
					description: 1,
					rating: 1,
					averageRating: { $avg: '$commentsAndRating.rating' },
				},
			},
			{ $sort: { averageRating: -1 } },
		]);

		res.json(sortedRestaurants);
	} catch (error) {
		console.error('Restaurant sorting failed:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const findNearestRestaurants = async (req, res) => {
	try {
		const nearestRestaurants = await Restaurant.find({
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [39.93, 32.85],
					},
				},
			},
		}).limit(5);

		res.json(nearestRestaurants);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const addMenuItemsWithTransaction = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const restaurant = await Restaurant.findOne({ name: 'Voco Fast Food' }).session(session);

		if (!restaurant) {
			throw new Error('Can not find restaurant');
		}

		const menuItems = [
			{ name: 'Küçük boy peynirli pizza', price: 50 },
			{ name: 'Orta boy mantarlı pizza', price: 100 },
			{ name: 'Hamburger', price: 120 },
		];

		for (const menuItem of menuItems) {
			const newMenuItem = await Menu.create([menuItem], { session });
			restaurant.menu.push(newMenuItem[0]);
		}

		await restaurant.save({ session });

		await session.commitTransaction();
		session.endSession();

		res.send('Menu is added successfully.');
	} catch (error) {
		console.error('Error:', error);

		await session.abortTransaction();
		session.endSession();

		res.status(500).json({ error: error.message || 'Internal server error' });
	}
};
//addMenuItemsWithTransaction();


const findRecentMaleUsersByAge = async () => {
	try {
		const recentComments = await Restaurant.aggregate([
			{ $unwind: '$commentsAndRating' },
			{ $match: { 'commentsAndRating.user.gender': 'male' } },
			{ $sort: { 'commentsAndRating.createdAt': -1 } },
			{
				$lookup: {
					from: 'users',
					localField: 'commentsAndRating.user',
					foreignField: '_id',
					as: 'userInfo',
				},
			},
			{ $unwind: '$userInfo' },
			{
				$project: {
					_id: '$commentsAndRating.user',
					username: '$userInfo.username',
					gender: '$userInfo.gender',
					birthday: '$userInfo.birthday',
					createdAt: '$commentsAndRating.createdAt',
				},
			},
			{ $sort: { birthday: -1 } },
			{ $limit: 20 },
		]);

		console.log('Sorting completed:');
		console.log(recentComments);
	} catch (error) {
		console.error('Hata:', error);
	}
};

//findRecentMaleUsersByAge();



// Routes
app.get('/restaurants', getRestaurants);
app.get('/restaurants/sortedByAverageRating', getRestaurantsSortedByAverageRating);
app.get('/restaurants/findNearest', findNearestRestaurants);




app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
