mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/booklist'

# Models
Users = require '../models/user-model.js'

exports.User = class User

  # Get all Users
  findAll: (callback) ->
    Users.find {}, (err, users) ->
      if !err
        callback users 

  # Get a user by ID
  findById: (id, callback) ->
    Users.find {'goodreadsID': id}, (err, user) ->
      if !err
        callback user

  # Add a user by Goodreads ID
  addUser: (goodreadsID, name, callback) ->
    user = new Users { 'goodreadsID': goodreadsID, 'name': name}
    user.save (err, user_saved) ->
      if err
        console.log 'Error Saving: ' + err
      else
        console.log 'Saved: ' + user