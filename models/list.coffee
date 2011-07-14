mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/booklist'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

Book = new Schema {
	uid	: { type: String, required: true, unique: true }
  }

List = new Schema {
  uid : { type: String, required: true, unique: true },
  name : { type: String, required: true },
  userId : { type: String, required: true },
	active : { type: Number, default: 1 },
	likes : { type: Number, default: 0 },
  books : [ Book ]
  }

mongoose.model 'List', List
List = mongoose.model 'List'

exports.Lists = class Lists
  
  # Get all Users
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