const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: Number,
    date: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
);

const Comment = model("Comment", CommentSchema, "comments");

module.exports = Comment;
