mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/booklist'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

List = new Schema()
List.add {
	# See /models/lists.coffee for List definition
	uid	: { type: String, required: true, unique: true }

}

Like = new Schema()
Like.add {
	# A user can like n books
	uid	: { type: String, required: true, unique: true },
	bookID : { type: String, required: true, unique: true },
	value : { type: Number, default: 1 }, # Like - 1, Dislike - 0
	created : { type: Date, required: true }
}

UserSchema = new Schema {
  name : { type: String, required: true },
  goodreadsID : { type: String, required: true },
  active : { type: Number, default: 1 },
  lists : [ List ],  # A list contains n books
  likes : [ Like ]
}

mongoose.model 'User', UserSchema
module.exports = db.model 'User' 