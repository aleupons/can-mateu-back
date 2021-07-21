const { Schema, model } = require("mongoose");

const BasketSchema = new Schema(
  {
    photoUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    basketProducts: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          unit: {
            type: String,
            required: true,
          },
        },
      ],
    },
    stock: {
      type: Number,
      required: true,
    },
    priceUnit: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    discount: Number,
    date: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
);

const Basket = model("Basket", BasketSchema, "baskets");

module.exports = Basket;
