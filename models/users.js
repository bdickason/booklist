var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/booklist');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;


var List = new Schema({
	uid	: { type: String, required: true, unique: true }
	// See /models/lists.js for List definition
});

var Like = new Schema({
	// A user can like n books
	uid	: { type: String, required: true, unique: true },
	bookID : { type: String, required: true, unique: true },
	like : { type: Number, default: 1 }, // Like - 1, Dislike - 0
	created : { type: Date, required: true }
});

var User = new Schema({
    uid : { type: String, required: true, unique: true },
    name : { type: String, required: true },
    userID : { type: String, required: true },
	active : { type: Number, default: 1 },
    lists : [List],  // A list contains n books
    likes : [Like]
});

mongoose.model('User', User);
var User = mongoose.model('User');

Users = function(){};

// Get all Users
Users.prototype.getUsers = function (callback) {

User.find({}, function (err, users) {
	    if (!err) {
		    callback(users);
	    }
	});
}; 

// Get a list by ID
Users.prototype.findByID = function (id, callback) {
  User.findById(id, function (err, user) {
      if (!err) {
        callback(user);
      }
  });
};



exports.Users = Users;