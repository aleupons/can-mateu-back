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

module.exports = shoppingCartSchema;
