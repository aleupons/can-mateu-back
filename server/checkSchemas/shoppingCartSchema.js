const shoppingCartSchema = {
  userId: {
    isMongoId: true,
    errorMessage: "L'usuari no és correcte",
  },
  products: {
    isArray: true,
    errorMessage: "Els productes no són correctes",
  },
  price: {
    isNumeric: true,
    errorMessage: "El preu no és correcte",
  },
};

const shoppingCartProductSchema = {
  productId: {
    isMongoId: true,
    errorMessage: "El producte no és correcte",
  },
  amount: {
    isNumeric: true,
    errorMessage: "La quantitat del producte no és correcta",
  },
};

module.exports = { shoppingCartSchema, shoppingCartProductSchema };
