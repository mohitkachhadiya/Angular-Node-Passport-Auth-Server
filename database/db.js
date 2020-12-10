var mongoose = require("mongoose");
const DB_URL   = process.env.DB_URL;

mongoose.connect(DB_URL, {useNewUrlParser:true, useUnifiedTopology:true}, (error, connection) => {
	if(!error) {
		console.log("We are connected");
	}else{
		// handle DB error
	}
});