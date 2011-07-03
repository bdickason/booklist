var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/booklist');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;


var Book = new Schema({
	uid	: { type: String, required: true, unique: true },
	title : { type: String, required: true },
	author : { type: String, required: true },
	isbn : { type: Number, required: true }, // We use ISbN13
	cover : { type: String },
	rating : { type: Number }
});

mongoose.model('Book', Book);
var Book = mongoose.model('Book');

Books = function(){};

// Get all Users
Books.prototype.getBooks = function (callback) {

    Book.find({}, function (err, books) {
	    if (!err) {
		    callback(books);
	    }
	});
}; 

// Get a list by ID
Books.prototype.findById = function (id, callback) {
  Book.findById(id, function (err, book) {
      if (!err) {
        callback(book);
      }
  });
};

exports.Books = Books;