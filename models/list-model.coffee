mongoose = require 'mongoose'
Book = require './book-model.js'

db = mongoose.connect 'mongodb://localhost/booklist'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

ListSchema = new Schema {
  uid : { type: String, required: true, unique: true },
  name : { type: String, required: true },
  userId : { type: String, required: true },
  active : { type: Number, default: 1 },
  likes : { type: Number, default: 0 },
  books : [ Book.schema ]
}

mongoose.model 'List', ListSchema
module.exports = db.model 'List'