(function() {
  var User, Users, db, mongoose;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  Users = require('../models/user-model.js');
  exports.User = User = (function() {
    function User() {}
    User.prototype.getUsers = function(callback) {
      return Users.find({}, function(err, users) {
        if (!err) {
          return callback(users);
        }
      });
    };
    User.prototype.findById = function(id, callback) {
      return Users.find({
        'goodreadsID': id
      }, function(err, user) {
        if (!err) {
          return callback(user);
        }
      });
    };
    User.prototype.addUser = function(goodreadsID, name, callback) {
      var user;
      user = new Users({
        'goodreadsID': goodreadsID,
        'name': name
      });
      return user.save(function(err, user_saved) {
        if (err) {
          return console.log('Error Saving: ' + err);
        } else {
          return console.log('Saved: ' + user);
        }
      });
    };
    return User;
  })();
}).call(this);
