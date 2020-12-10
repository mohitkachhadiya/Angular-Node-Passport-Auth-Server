const mongoose = require("mongoose");

// var userFacebookSchema = new mongoose.Schema({
// 	facebookId: {type: String},
// 	name: {type: String},
// 	email: {type: String},
// 	first_name: {type: String},
// 	last_name: {type: String}
// });

// var userGoogleSchema = new mongoose.Schema({
// 	googleId: {type: String},
// 	email: {type:String, required:true, unique:true},
// });

// var userSchema = new mongoose.Schema({
// 	username: {type: String},
// 	password: {type: String},
// });

// var userTwitterSchema = new mongoose.Schema({
// 	twitterId: {type: String},
// 	email: {type: String},
// 	name: {type: String},
// 	username: {type: String},
// });

// userLocal: {
// 		username: {type: String},
// 		password: {type: String},
// 	},
// 	facebookUser: {
// 		facebookId: {type: String},
// 		name: {type: String},
// 		email: {type: String},
// 		first_name: {type: String},
// 		last_name: {type: String},
// 		provider: {type: String}
// 	},
// 	googleUser: {
// 		googleId: {type: String},
// 		email: {type: String},
// 		provider: {type: String}
// 	},
// 	twitterUser: {
// 		twitterId: {type: String},
// 		email: {type: String},
// 		name: {type: String},
// 		username: {type: String},
// 		provider: {type: String}	
// 	}


var UserSchema = new mongoose.Schema({
	userId: {type: String, unique: true},
	username: {type: String},
	password: {type: String},
	displayName: {type: String},
	email: {type: String},
	first_name: {type: String},
	last_name: {type: String},
	provider: {type: String},
	confirmPassword: {type: String},
	passChange: {type: Number, default: 0}
});

const User =  mongoose.model("user", UserSchema);
// const UserFacebook  =  mongoose.model("userFacebook", userFacebookSchema);
// const UserGoogle  =  mongoose.model("userGoogle", userGoogleSchema);
// const UserTwitter  =  mongoose.model("userTwitter", userTwitterSchema);
