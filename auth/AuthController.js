var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

//configure jwt
var jwt = require('jsonwebtoken'); // create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../Config/config'); 

router.post('/login',function(req, res) {
//console.log(JSON.parse(req.body.email));
var isFilledLogin="";
  if(req.body.email !="" || req.body.password !="editor"){
	  isFilledLogin=true;
  }
  if(isFilledLogin){
	  User.findOne({ email: req.body.email }, function (err, user) {
		if (err) return res.status(500).send('Error on the server.');
		if (!user) return res.status(404).send('No user found.');
		console.log("User"+ user);
		console.log("User Role"+ user.role);
		var user_role = user.role;
		// check if the password is valid
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

		// if user is found and password is valid
		// create a token
		var token = jwt.sign({ id: user._id }, config.secret, {
		  expiresIn: 86400 // expires in 24 hours
		});


		res.status(200).send({ auth: true, token: token, role: user_role});
	  });
  }
  else{
	  res.status(401);
  }
});


router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  var isValidateRole;
  if(req.body.role=="user" || req.body.role=="editor"){
	  isValidateRole=true;
  }

  if(req.body.name !="" && req.body.email !="" && req.body.password !="" && isValidateRole){
	  User.create({
		name : req.body.name,
		email : req.body.email,
		password : hashedPassword,
		role:req.body.role
	  }, 
	  function (err, user) {
		if (err) return res.status(500).send("There was a problem registering the user`.");

		
		var token = jwt.sign({ id: user._id }, config.secret, {
		  expiresIn: 86400 // expires in 24 hours
		});

		res.status(200).send({ auth: true, token: token });
	  });
  }
  else{
	  res.status(503).send("Please fill all the information");
  }

});


module.exports = router;
