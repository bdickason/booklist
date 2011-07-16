mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/booklist'

# Models
Lists = require '../models/list-model.js'

exports.Lists = class Lists
  
  # Get all Lists in the system
  getLists: (callback) ->
    List.find {}, (err, lists) ->
      if !err
  	    callback lists

  # Get a list by ID
  findById: (id, callback) ->
    List.findById id, (err, list) ->
      if !err
        callback list

  # Get lists for a given User
  findByUserId: (id, callback) ->
    List.find { 'userId': userId }, (err, lists) ->
      if !err
        callback lists
  
  # Add a list to a user's shelf
  addList: (userId, json, callback) ->
    