var express = require('express');
var app = express();
var db = require('./DB/db');
var cors = require('cors');

app.use(cors());

global.__root   = __dirname + '/'; 

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

var BookController = require(__root + 'book/BookController');
app.use('/api/books', BookController);

var ImageController = require(__root + 'ImageUpload/ImageController');
app.use('/api/images', ImageController);

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;