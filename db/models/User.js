const { SchemaTypes, Schema, model } = require("mongoose");
require("mongoose-type-email");

SchemaTypes.Email.defaults.message =
  "L'adreça de correu electrònic és invàlida";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
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
      type: SchemaTypes.Email,
      required: true,
      unique: true,
    },
    address: String,
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  { versionKey: false }
);

const User = model("User", UserSchema, "users");

module.exports = User;
