const { Schema, model } = require("mongoose");

const ShoppingCardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            unique: true,
          },
          amount: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { versionKey: false }
);

const ShoppingCard = model(
  "ShoppingCard",
  ShoppingCardSchema,
  "shopping-cards"
);

module.exports = ShoppingCard;
