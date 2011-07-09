(function() {
  var Like, List, ObjectId, Schema, User, Users, db, mongoose;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  Schema = mongoose.Schema;
  ObjectId = Schema.ObjectId;
  List = new Schema({
    uid: {
      type: String,
      required: true,
      unique: true
    }
  });
  Like = new Schema({
    uid: {
      type: String,
      required: true,
      unique: true
    },
    bookID: {
      type: String,
      required: true,
      unique: true
    },
    like: {
      type: Number,
      "default": 1
    },
    created: {
      type: Date,
      required: true
    }
  });
  User = new Schema({
    uid: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    userID: {
      type: String,
      required: true
    },
    active: {
      type: Number,
      "default": 1
    }
    /* Can't seem to get these working in .coffee */
  });
  mongoose.model('User', User);
  User = mongoose.model('User');
  exports.Users = Users = (function() {
    function Users() {}
    Users.prototype.getUsers = function(callback) {
      return User.find({}, function(err, users) {
        if (!err) {
          return callback(users);
        }
      });
    };
    Users.prototype.findByID = function(id, callback) {
      return User.findById(id, function(err, user) {
        if (!err) {
          return callback(user);
        }
      });
    };
    return Users;
  })();
}).call(this);
