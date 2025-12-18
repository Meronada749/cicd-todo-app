const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: false
    },
    completed: {
      type: Boolean,
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
});

//index text en MongoDB, équivalent FULLTEXT (MySQL)
todoSchema.index({text: "text"});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
