(function() {
<<<<<<< HEAD
  var Book, List, Lists, ObjectId, Schema, db, mongoose;
=======
  var ListSchema, ObjectId, Schema, db, mongoose;
>>>>>>> lists
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  Schema = mongoose.Schema;
  ObjectId = Schema.ObjectId;
<<<<<<< HEAD
  Book = new Schema({
    uid: {
      type: String,
      required: true,
      unique: true
    }
  });
  List = new Schema({
    uid: {
      type: String,
      required: true,
=======
  ListSchema = new Schema({
    uid: {
      type: String,
>>>>>>> lists
      unique: true
    },
    name: {
      type: String,
<<<<<<< HEAD
      required: true
    },
    userId: {
      type: String,
      required: true
=======
      unique: true,
      required: true,
      dropDups: true
    },
    userId: {
      type: String
>>>>>>> lists
    },
    active: {
      type: Number,
      "default": 1
    },
    likes: {
      type: Number,
      "default": 0
    },
<<<<<<< HEAD
    books: [Book]
  });
  mongoose.model('List', List);
  List = mongoose.model('List');
  exports.Lists = Lists = (function() {
    function Lists() {}
    Lists.prototype.getLists = function(callback) {
      return List.find({}, function(err, lists) {
        if (!err) {
          return callback(lists);
        }
      });
    };
    Lists.prototype.findById = function(id, callback) {
      return List.findById(id, function(err, list) {
        if (!err) {
          return callback(list);
        }
      });
    };
    Lists.prototype.findByUserId = function(id, callback) {
      return List.find({
        'userId': userId
      }, function(err, lists) {
        if (!err) {
          return callback(lists);
        }
      });
    };
    return Lists;
  })();
=======
    books: [
      {
        type: String
      }
    ]
  });
  mongoose.model('List', ListSchema);
  module.exports = db.model('List');
>>>>>>> lists
}).call(this);
