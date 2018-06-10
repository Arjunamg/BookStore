'use strict';

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";
const fs = require('fs');

var rawdata = fs.readFileSync('books.json');  
var books = JSON.parse(rawdata);  
 

MongoClient.connect(url, function(err, database) {
	var db=database.db('Books-Collection');
    var collections=db.collection('books');
  if (err) throw err;
  
  collections.insertMany(books, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    //db.close();
  });
});


