(function() {
  var List, Lists, db, mongoose;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  Lists = require('../models/list-model.js');
  exports.List = List = (function() {
    function List() {}
    List.prototype.getLists = function(callback) {
      return Lists.find({}, function(err, lists) {
        if (!err) {
          return callback(lists);
        }
      });
    };
    List.prototype.findById = function(id, callback) {
      return Lists.findById(id, function(err, list) {
        if (!err) {
          return callback(list);
        }
      });
    };
    List.prototype.findByUserId = function(id, callback) {
      return Lists.find({
        'userId': userId
      }, function(err, lists) {
        if (!err) {
          return callback(lists);
        }
      });
    };
    List.prototype.add = function(userId, json, callback) {
      console.log("UserId: " + userId);
      return console.log("Json:" + json);
    };
    return List;
  })();
}).call(this);
