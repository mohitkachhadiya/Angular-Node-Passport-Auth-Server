 var userHandler = require('./controllers/user.controller.js');
 const passport = require('passport');

 exports.setupAPIs = (app,expressJwt) => {
 	
 	/* <----- Register User -----> */
 	app.post('/register', userHandler.registerUser);

 	/* <----- Local Data Login -----> */
 	app.post('/login', passport.authenticate('local', { failureRedirect: 'http://localhost:4000/login' }), (request, response) => {
 		console.log('request of user login ', request)
 		if (request.user)
 			response.status(200).send(request.user)
 		response.status(404)
 	});

 	//Facebook Login 
 	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'], return_scopes: true }));
 	
 	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (request, response) => {
 		console.log('session in Facebook', request.session, request.user)
 		if (!request.user._json.email){
 			request.session.passport.user = request.user;
 			console.log('response......>>>>>>.............', request.session);
 			response.redirect('http://localhost:4200/model/'+request.user.id);
 		}
 		else {
 			response.redirect('http://localhost:4200/home');
 		}
 	});

 	//Email
 	app.post('/email', userHandler.getEmail);

 	//Get User By Id
 	app.get('/getUserById/:id', userHandler.getUserById);

 	//Google Login
 	app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

 	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (request, response) => {
 		response.redirect('http://localhost:4200/home');
 	});

 	//Twitter Login
 	app.get('/auth/twitter', passport.authenticate('twitter', { scope: ['email']}));

 	app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), (request, response) => {
 		if (!request.user._json.email){
 			request.session.passport.user = request.user;
 			console.log('response......>>>>>>.............', request.session.passport.user);
 			response.redirect('http://localhost:4200/model');
 		}
 		else {
 			response.redirect('http://localhost:4200/home');
 		}
 	});
 	
 	//Logout
 	app.get('/logout', userHandler.logout);


 	/* <------- Send Email Link -------> */
 	app.post('/sendEmail', userHandler.sendEmailLink);

 	app.put('/resetPass/:id', userHandler.resetPassword);
 }