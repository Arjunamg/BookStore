var mongoose = require('mongoose');  

//path and originalname are the fields stored in mongoDB
var imageSchema = mongoose.Schema({
 path: {
 type: String,
 required: true,
 trim: true
 },
 originalname: {
 type: String,
 required: true
 }
 
});

mongoose.model('files', imageSchema);
module.exports = mongoose.model('files');