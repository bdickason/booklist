mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/booklist'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

Book = new Schema {
  uid	: { type: String, required: true, unique: true },
  title : { type: String, required: true },
  author : { type: String, required: true },
  isbn : { type: Number, required: true }, # We use ISBN13
  cover : { type: String },
  rating : { type: Number }
}

mongoose.model 'Book', Book
Book = mongoose.model 'Book'

