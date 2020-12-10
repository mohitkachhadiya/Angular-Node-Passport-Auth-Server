var nodemailer = require('nodemailer');

exports.sendMail = (body, CB)=>{
	console.log("the body of nodemailer function =====>", body);
	
	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		requireTLS: true,
		auth: {
			user:  'mohitkachhadiya312@gmail.com',
			pass:  '1K2a3c984h5h@mvk'
		}
	});

	var mailOptions = {
		from: 'mohitkachhadiya312@gmail.com',
		to : body.email,
		subject: 'Forgot Your Password',
		text: "hello mohit",
		html: '<p>Click <a href="http://localhost:4200/model/'+body._id+'"><button type="button">Here</button></a> to reset your password</p>'
	};
	
	transporter.sendMail(mailOptions, function(error, info){
		console.log('error is the =----------->', error)
		if (error) {
			return CB(error, null)
		} else {
			console.log('>>>>>>>>>>>data', info)
			return CB(null, info)
		}
	});
};