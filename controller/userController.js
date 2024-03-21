const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const register = async (req, res) => {
	try {
		const { username, email, password, address, gender, birthday } = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new User({
			username,
			email,
			password: hashedPassword,
			address,
			gender,
			birthday,
		});

		await user.save();

		res.status(201).json({ message: 'User saved successfully.' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Wrong password' });
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};




module.exports = { login, register };
