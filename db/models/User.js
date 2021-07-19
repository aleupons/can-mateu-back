const { mongoose, Schema, model } = require("mongoose");
require("mongoose-type-email");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    pasword: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surnames: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      unique: true,
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
      unique: true,
    },
    address: String,
  },
  { versionKey: false }
);

const User = model("User", UserSchema, "users");

module.exports = User;
