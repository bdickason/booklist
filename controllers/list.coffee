mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/booklist'

# Models
Lists = require '../models/list-model.js'

exports.List = class List
  
  # Get all Lists in the system
  findAll: (callback) ->
    Lists.find {}, (err, lists) ->
      if !err
  	    callback lists

  # Get lists for a given User
  findByUserId: (id, callback) ->
    Lists.find { 'userId': userId }, (err, lists) ->
      if !err
        callback lists
  
  # Add a list to a user's shelf
  add: (json, callback) ->
    tmp = new Lists { 'name': json.name }
    tmp.save (err) ->
      if !err
        console.log 'Saved List: ' + tmp.name
        callback tmp
      else
        console.log 'ERROR Saving: ' + tmp.name + err
        callback err
#    Lists.save (err) ->
#      if !(err) 
#        console.log 'Success! Added: ' + json.name
        