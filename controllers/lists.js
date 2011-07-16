(function() {
  var Lists, db, mongoose;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  Lists = require('../models/list-model.js');
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
    Lists.prototype.addList = function(userId, json, callback) {};
    return Lists;
  })();
}).call(this);
