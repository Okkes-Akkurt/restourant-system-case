const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	address: [
		{
			type: String,
			required: true,
			trim: true,
		},
	],
	gender: {
		type: String,
		required: true,
		trim: true,
	},
	birthday: {
		type: Date,
		required: true,
		trim: true,
	},
	profilePhoto: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
