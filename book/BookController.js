var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Books = require('./Books');

//Enter multiple books at a time


// ENTERS BOOK INFORMATION
//validation to be done allowed only if he is editor
//editor has to upload the image in same path which he gives for Image link.(In this case image link is upload/<img>.jpg)
//this link will be shown at the time of display of book.From where image can be downloaded.
router.post('/insertBookInformationFromEditor', VerifyToken,function (req, res) {
		if(req.body.role==="Editor") {
			
			if(req.body.author !="" && req.body.isbn !="" && req.body.title !="" && req.body.genre !=""){
				Books.create({
						author: req.body.author,
						isbn: req.body.isbn,
						title: req.body.title,
						genre: req.body.genre,
						imageLink: "http://myserver.com/"+req.body.imageLink,
						link: req.body.link,
						isCoverAvailable:req.body.isCoverAvailable
					}, 
					function (err, user) {
						if (err) return res.status(500).send("There was a problem adding the information to the database.");
						res.status(200).send(user);
					});
				} 
				else{
					res.send("Please fill author,isbn,title,genre information ");
				}
		}
		else{
		   res.status(401).send("Forbidden");
		}

});


// RETURNS ALL THE BOOK IN THE DATABASE
router.get('/findAllBooks', VerifyToken,function (req, res) {
	  Books.find({}, function (err, books) {
        if (err) return res.status(500).send("There was a problem finding the books.");
        res.status(200).send(books);
    });
});

// GETS A SINGLE BOOK FROM THE DATABASE BASED 
router.get('/getBook/:search', function (req, res) {
	//To get the top 5 searched word everytime the book is searhced we will update the count corresponding to that book.
	//for caching the top 5 word we can use memcached.Everytime the search is made check from memacached if the word is found then 
	//return from there.By sorting the count of books we can add top 5 books to memacached.
	var search=req.params.search;
	//Searching by ignoring case
	var searchQuery={ $or:[ {'author':{ $regex: new RegExp("^" + search.toLowerCase(), "i") }}, {'genre':{ $regex: new RegExp("^" + search.toLowerCase(), "i") }},{'isbn':{ $regex: new RegExp("^" + search.toLowerCase(), "i") }}, {'title':{ $regex: new RegExp("^" + search.toLowerCase(), "i") }} ]}
    Books.find(searchQuery, function (err, book) {
        if (err) return res.status(500).send("There was a problem finding the books.");
        if (!book) return res.status(404).send("No user found.");
        res.status(200).send(book);
    });
});

// DELETES A BOOK FROM THE DATABASE
router.delete('/deleteBook/:id', function (req, res) {
    Books.findByIdAndRemove(req.params.id, function (err, books) {
        if (err) return res.status(500).send("There was a problem deleting the book.");
        res.status(200).send("book: "+ books.title +" was deleted.");
    });
});

// UPDATES A SINGLE BOOK IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.put('/updateBook/:id',  VerifyToken,  function (req, res) {
    Books.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, books) {
        if (err) return res.status(500).send("There was a problem updating the book.");
        res.status(200).send(books);
    });
});


module.exports = router;