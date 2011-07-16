(function() {
  var List, Lists, db, mongoose;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  Lists = require('../models/list-model.js');
  exports.List = List = (function() {
    function List() {}
    List.prototype.findAll = function(callback) {
      return Lists.find({}, function(err, lists) {
        if (!err) {
          return callback(lists);
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
    List.prototype.add = function(json, callback) {
      var tmp;
      tmp = new Lists({
        'name': json.name
      });
      return tmp.save(function(err) {
        if (!err) {
          console.log('Saved List: ' + tmp.name);
          return callback(tmp);
        } else {
          console.log('ERROR Saving: ' + tmp.name + err);
          return callback(err);
        }
      });
    };
    return List;
  })();
}).call(this);
