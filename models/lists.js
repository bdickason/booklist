(function() {
  var Book, List, Lists, ObjectId, Schema, db, mongoose;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  Schema = mongoose.Schema;
  ObjectId = Schema.ObjectId;
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
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    active: {
      type: Number,
      "default": 1
    },
    likes: {
      type: Number,
      "default": 0
    }
    /* Can't seem to get this to compile in .coffee */
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
}).call(this);
