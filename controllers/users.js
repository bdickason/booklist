(function() {
  var User, Users, db, mongoose;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  User = require('../models/user-model.js');
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
      var user;
      user = new User;
      return user.findById(id, function(err, user) {
        if (!err) {
          return callback(user);
        }
      });
    };
    Users.prototype.addUser = function(goodreadsID, name, callback) {
      var user;
      user = new User({
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
    return Users;
  })();
}).call(this);
