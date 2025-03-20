const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Category",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

postSchema.virtual('summery').get(function () {
  if(this.content.length > 30) {
    return this.content.substring(0,50)+"..."
  }
})

postSchema.set('toJSON', { virtuals: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
