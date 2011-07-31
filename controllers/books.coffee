mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/booklist'

# Models
Books = require '../models/books-model.js'

exports.Books = class Books

  getBooks: (callback) ->
    Book.find {}, (err, books) ->
      if !err
        callback books
        
  findById: (id, callback) ->
    Book.find { 'id': id }, (err, book) ->
      if !err
        callback book
