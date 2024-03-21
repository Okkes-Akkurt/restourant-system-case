const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
	city: {
		type: String,
		required: true,
		trim: true,
	},
	district: {
		type: String,
		required: true,
		trim: true,
	},
	street: {
		type: String,
		required: true,
		trim: true,
	},
});

const restaurantTypeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
});

const menuSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	image: {
		type: String,
	},
});

const commentAndRatingSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	comment: {
		type: String,
		trim: true,
	},
	rating: {
		type: String,
	},
});


const branchSchema = new mongoose.Schema({
	location: {
		type: String,
		required: true,
	},
	address: addressSchema,
	comments: commentAndRatingSchema,
});

const restaurantSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	logo: {
		type: String,
		required: true,
	},
	location: {
		type: [Number],
		required: true,
	},
	address: addressSchema,
	types: [restaurantTypeSchema],
	branches: [branchSchema],
	menu: [menuSchema],
	commentsAndRating: [commentAndRatingSchema],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
