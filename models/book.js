(function() {
  var Book, Books, ObjectId, Schema, db, mongoose;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  Schema = mongoose.Schema;
  ObjectId = Schema.ObjectId;
  Book = new Schema({
    uid: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    isbn: {
      type: Number,
      required: true
    },
    cover: {
      type: String
    },
    rating: {
      type: Number
    }
  });
  mongoose.model('Book', Book);
  Book = mongoose.model('Book');
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
      return Book.findById(id, function(err, book) {
        if (!err) {
          return callback(book);
        }
      });
    };
    return Books;
  })();
}).call(this);
