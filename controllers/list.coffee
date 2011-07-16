mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/booklist'

# Models
Lists = require '../models/list-model.js'

exports.List = class List
  
  # Get all Lists in the system
  getLists: (callback) ->
    Lists.find {}, (err, lists) ->
      if !err
  	    callback lists

  # Get a list by ID
  findById: (id, callback) ->
    Lists.findById id, (err, list) ->
      if !err
        callback list

  # Get lists for a given User
  findByUserId: (id, callback) ->
    Lists.find { 'userId': userId }, (err, lists) ->
      if !err
        callback lists
  
  # Add a list to a user's shelf
  add: (userId, json, callback) ->
    console.log "UserId: " + userId
    console.log "Json:" + json