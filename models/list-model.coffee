mongoose = require 'mongoose'

db = mongoose.connect 'mongodb://localhost/booklist'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

ListSchema = new Schema {
  uid : { type: String, unique: true },
  name : { type: String, unique: true, required: true, dropDups: true},
  userId : { type: String },
  active : { type: Number, default: 1 },
  likes : { type: Number, default: 0 },
  books : [ { type: String } ]
}

mongoose.model 'List', ListSchema
module.exports = db.model 'List'