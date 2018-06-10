var mongoose = require('mongoose');  
var BookSchema = new mongoose.Schema({  
  
    author: String,
    isbn: String,
    imageLink: String,
    link: String,
	genre: String,
    title: String,
	isCoverAvailable:String
});
mongoose.model('Books', BookSchema);

module.exports = mongoose.model('Books');