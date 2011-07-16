(function() {
  var Books, db, mongoose;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  Books = require('../models/books-model.js');
  exports.Books = Books = (function() {
    function Books() {}
    Books.prototype.getBooks = function(callback) {
      return Book.find({}, function(err, books) {
        if (!err) {
          return callback(books);
        }
      });
    };
    Books.prototype.findById = function(id, callback) {
      return Book.find({
        'id': id
      }, function(err, book) {
        if (!err) {
          return callback(book);
        }
      });
    };
    return Books;
  })();
}).call(this);
