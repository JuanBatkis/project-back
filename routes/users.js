const express = require('express');
const router = express.Router();
//import important things
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {clearRes} = require('../utils/auth');


//POST Sign Up
router.post('/signup', (req, res, next) => {

	const {email, password, confirmPassword, name} = req.body;

	if (password !== confirmPassword) return res.status(403).json({msg: `Passwords don't match`});

	bcrypt.hash(password, 10).then((hashedPassword) => {

		const user = {email, password: hashedPassword, name};

		User.create(user).then(() => {
			res.status(200).json({msg: 'User created'});
		}).catch((error) => {
			res.status(400).json({msg: 'An error occurred', error});
		});

	});

});

//POST Log In
router.post('/login', (req, res, next) => {

	const {email, password} = req.body;

	User.findOne({email})
		.then((user) => {

			if (user === null) return res.status(404).json({msg: `User doesn't exists`});

			bcrypt.compare(password, user.password).then((match) => {
				if (match) {
					//Delete password for the user
					//const withoutPass = user.toObject();
					//delete withoutPass.password;
					const newUser = clearRes(user.toObject());
					const token = jwt.sign({id: user._id}, process.env.SECRET, {
						expiresIn: '1d'
					});

					res.cookie('token', token, {
						expires: new Date(Date.now + 86400000),
						secure: false,
						httpOnly: true,
					}).json({user: newUser, code: 200});
				} else {
					return res.status(401).json({msg: `Wrong password`});
				}
			});

		}).catch((error) => {
			res.status(400).json({msg: 'An error occurred', error});
		});

});

//POST Log Out
router.post('/logout', (req, res) => {
	res.clearCookie('token').json({msg: 'Come back soon!'});
})


module.exports = router;