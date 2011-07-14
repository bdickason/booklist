(function() {
  var Like, List, ObjectId, Schema, User, UserSchema, db, mongoose;
  mongoose = require('mongoose');
  db = mongoose.connect('mongodb://localhost/booklist');
  Schema = mongoose.Schema;
  ObjectId = Schema.ObjectId;
  List = new Schema();
  List.add({
    uid: {
      type: String,
      required: true,
      unique: true
    }
  });
  Like = new Schema();
  Like.add({
    uid: {
      type: String,
      required: true,
      unique: true
    },
    bookID: {
      type: String,
      required: true,
      unique: true
    },
    value: {
      type: Number,
      "default": 1
    },
    created: {
      type: Date,
      required: true
    }
  });
  UserSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    goodreadsID: {
      type: String,
      required: true
    },
    active: {
      type: Number,
      "default": 1
    },
    /* Can't seem to get these working in .coffee */
    lists: [List],
    likes: [Like]
  });
  mongoose.model('User', UserSchema);
  User = mongoose.model('User');
}).call(this);
