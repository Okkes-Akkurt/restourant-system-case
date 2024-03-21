const mongoose = require('mongoose');

const connectDB = () => {
	mongoose
		.connect(process.env.DB_URI, {
			dbName: 'restaurant-manage',
		})
		.then(() => {
			console.log('Connected to MongoDB');
		})
		.catch((error) => {
			console.log('Failed to connect to MongoDB :: ', error);
		});
};

module.exports = connectDB;
