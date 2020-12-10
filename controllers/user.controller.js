const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const UserData = require('../models/user.model');
const User = mongoose.model('user');
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const nodemailer = require('nodemailer');
var mailHandler = require('../services/mail.service');

//Register User
exports.registerUser = (request, response) => {
	const hashedPassword = bcrypt.hashSync(request.body.password , 10);
	console.log('>>>>>>>>>request.body', request.body)

	if (!request.body.username || !request.body.email || !request.body.first_name || !request.body.last_name || !request.body.password || !request.body.confirmPassword)
		return response.status(412).send({message : 'Please Enter all Fields'})

	User.create({
		username: request.body.username,
		email: request.body.email,
		first_name: request.body.first_name,
		last_name: request.body.last_name,
		password: request.body.password,
		confirmPassword: request.body.confirmPassword
	}, (err, user) => {
		console.log('>>>>>>>>>>>>>>>>>>', user, err)
	console.log('>>>>>>>>>request.body', request.body)

		if (err)
			return response.status(500).send(err);

		if (!user)
			return response.status(404).send({message : 'User Not Found'})

		return response.status(200).send(user)
	})
}

isActive:Boolean

exports.resetPassword = (request, response) => {
	// const password = bcrypt.hashSync(request.body.password , 10);
	// const confirmPassword = bcrypt.hashSync(request.body.confirmPassword , 10);
	var update =  { 
		password : request.body.password, 
		confirmPassword : request.body.confirmPassword,
		passChange: 1 
	} 

	User.findOneAndUpdate({_id : request.params.id}, update, (error, user) => {
		console.log('user find >>>>>>>>>>>>', user);

		if (error)
			response.status(500).send(error);

		if (!user)
			response.status(404).send({message: 'User not Found'});

		if (user)
			response.status(200).send(user)
	})
}

//get User by userId
exports.getUserById = (request, response) => {
	var query = { $or: [{ userId : request.params.id }, { _id: request.params.id }]};

	User.findOne(query, (error, user) => {
		if (error)
			return response.status(500).send({ message : 'Get User Error.'})

		if (!user)
			return response.status(404).send({ message : 'User not Found.'})

		if (user)
			return response.status(200).send(user);
	})
}

//Local Data Login
passport.use(new LocalStrategy(
	(username, password, done) => {
	console.log('>>>>>>>>>>>>', username, password)	
		var query = { $or: [{ username: username }, { email: username }]};
		console.log('query', query)
		User.findOne(query, function(error, user) {
			if (error) 
				return done(error);
			
			if (!user)
				return done(null, false, { message: 'Incorrect username.' });

			// if (!bcrypt.compareSync(password, user.password))
				// return done(null, false)

			return done(null, user)
		});
	})
);

var user

//Facebook Login
passport.use(new facebookStrategy({
	clientID        : process.env.FACEBOOK_CLIENT_ID,
	clientSecret    : process.env.FACEBOOK_SECRET,
	callbackURL: 	  process.env.FACEBOOK_CALLBACK,
	profileFields: ["id", "displayName", "email", "name"],
	enableProof: true
}, async (token, refreshToken, profile, done) => {
	this.user = profile;
	if (!profile._json.email)
		return done(null, profile)

	// User.findOne({userId: profile.id} , (error, user) => {
		// if (error)
			// return done(null, false)


		// if (!user){
			User.create({
				userId: profile.id,
				displayName: profile._json.name,
				email: profile._json.email,
				first_name: profile._json.first_name,
				last_name: profile._json.last_name,
				provider: profile.provider
			}, (error, user) => {
				if (error)
					return done(null, false)
			})
		// }
	// });
	return done(null, profile)
}));

//getEmail
exports.getEmail = (request, response, next) => {
	console.log('get email time data >>>>>>>>>>>>>>', request.session);

	User.findOne({userId : this.user.id}, (error, user) => {
		if (error)
			return response.status(500).send(err);

		if (!user)
			User.create({
				userId: this.user.id,
				displayName: this.user._json.name,
				email: request.body.email,
				first_name: this.user._json.first_name,
				last_name: this.user._json.last_name,
				provider: this.user.provider
			}, (error, user) => {
				if (error)
					return response.status(500).send(err);

				if (!user)
					return response.status(404).send({message: 'User Not Found'});

				if (user)
					return response.status(200).send(user);
			});

		if (user)
			return response.send(user);
	})
}

//Google Login
passport.use(new GoogleStrategy({
	clientID:     process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
	User.findOne({userId: profile.id} , (error, user) => {
		if (error)
			return done(null, false)

		if (!user){
			User.create({ 
				userId: profile.id,
				displayName: profile.displayName,
				email: profile.email,
				provider: profile.provider
			}, (error, user) => {
				if (error)
					return done(null, false)
			})
		}	
	});
	return done(null, profile)
}));

//Twitter Login
passport.use(new TwitterStrategy({
	consumerKey: process.env.TWITTER_CLIENT_ID,
	consumerSecret: process.env.TWITTER_CLIENT_SECRET,
	callbackURL: process.env.TWITTER_CALLBACK_URL,
	includeEmail: true
}, (token, tokenSecret, profile, done) => {
	this.user = profile;
	if (!profile._json.email)
		return done(null, profile)

	User.findOne({userId: profile.id} , (error, user) => {
		if (error)
			return done(null, false)

		if (!user){
			User.create({
				userId: profile.id,
				username: profile._json.screen_name,
				displayName: profile._json.name,
				email: profile._json.email,
				provider: profile.provider
			}, (error, user) => {
				if (error)
					return done(null, false)
			})
		}
	});
	return done(null, profile)
}));

//Logout
exports.logout = (request, response) => {
	response.status(200).send({ message : 'User Successfully Logout'})
	return request.logout();
}

exports.sendEmailLink = (request, response) => {
	console.log('>>>>>>>', request.body)
	
	User.findOne({email: request.body.email}, (err, userData) => {
		console.log('the data user data is the >>>>>>>>>>>', userData);
		if (err)
			response.status(500).send(err);

		if (!userData)
			response.status(404).send({message: 'Enter Valid Email'});

		if (userData){
			User.updateOne({_id : userData._id}, { $set : { 'passChange' : 0}}, (err, user) => {
				if (err)
					response.status(500).send(err);

				if (!user)
					response.status(404).send({message: 'Enter Valid Email'});

				if (user)
					mailHandler.sendMail(userData, (error, res) => {
						response.status(200).send({message: 'Please Check Your email and Activate your Account'})
					});

			})
		}

	})
}
