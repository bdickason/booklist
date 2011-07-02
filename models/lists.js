var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/booklist');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;


var Book = new Schema({
	uid	: { type: String, required: true, unique: true }
});


var List = new Schema({
    uid : { type: String, required: true, unique: true },
    name : { type: String, required: true },
    userID : { type: String, required: true },
	active : { type: Number, default: 1 },
	likes : { type: Number, default: 0 },
    books : [Book]  // A list contains n books
});

mongoose.model('List', List);
var List = mongoose.model('List');

Lists = function(){};

// Get all Users
Lists.prototype.getLists = function (callback) {

List.find({}, function (err, lists) {
	    if (!err) {
		    callback(lists);
	    }
	});
}; 

// Get a list by ID
Lists.prototype.findById = function (id, callback) {
  List.findById(id, function (err, list) {
      if (!err) {
        callback(list);
      }
  });
};

// Get lists for a given User
Lists.prototype.findByUserID = function (userID, callback) {
  List.find({ 'userID': userID }, function (err, lists) {
      if (!err) {
        callback(lists);
      }
  });
};


exports.Lists = Lists;