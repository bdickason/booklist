mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/booklist'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

List = new Schema {
	uid	: { type: String, required: true, unique: true }
	# See /models/lists.coffee for List definition
}

Like = new Schema {
	# A user can like n books
	uid	: { type: String, required: true, unique: true },
	bookID : { type: String, required: true, unique: true },
	like : { type: Number, default: 1 }, # Like - 1, Dislike - 0
	created : { type: Date, required: true }
}

User = new Schema {
  uid : { type: String, required: true, unique: true },
  name : { type: String, required: true },
  userID : { type: String, required: true },
  active : { type: Number, default: 1 }
  ### Can't seem to get these working in .coffee ###
  # lists : [List],  // A list contains n books
  # likes : [Like]
}

mongoose.model 'User', User
User = mongoose.model 'User'

exports.Users = class Users

  # Get all Users
  getUsers: (callback) ->
    User.find {}, (err, users) ->
      if !err
  		    callback users 

  # Get a list by ID
  findByID: (id, callback) ->
    User.findById id, (err, user) ->
      if !err
        callback user
