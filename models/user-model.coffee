mongoose = require 'mongoose'
List = require './list-model.js'
db = mongoose.connect 'mongodb://localhost/booklist'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

###
LikeSchema = new Schema {
	# A user can like n books
	uid	: { type: String, required: true, unique: true },
	bookID : { type: String, required: true, unique: true },
	value : { type: Number, default: 1 }, # Like - 1, Dislike - 0
	created : { type: Date, required: true }
}
###

UserSchema = new Schema {
  name : { type: String, required: true },
  goodreadsID : { type: String, required: true },
  active : { type: Number, default: 1 },
  lists : [ List.schema ]  # A list contains n books
  # likes : [ Like.schema ]
}

mongoose.model 'User', UserSchema
module.exports = db.model 'User' 