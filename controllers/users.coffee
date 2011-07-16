mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/booklist'

# Models
User = require '../models/user.js'

exports.Users = class Users

  # Get all Users
  getUsers: (callback) ->
    User.find {}, (err, users) ->
      if !err
  		    callback users 

  # Get a list by ID
  findByID: (id, callback) ->
    user = new User
    user.findById id, (err, user) ->
      if !err
        callback user

  # Add a user by Goodreads ID
  addUser: (goodreadsID, name, callback) ->
    user = new User { 'goodreadsID': goodreadsID, 'name': name}
    user.save (err, user_saved) ->
      if err
        console.log 'Error Saving: ' + err
      else
        console.log 'Saved: ' + user
    