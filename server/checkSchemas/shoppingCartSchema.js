const shoppingCartSchema = {
  userId: {
    optional: true,
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
  isBasket: {
    isBoolean: true,
    errorMessage: "S'ha d'indicar si s'està afegint un producte o una cistella",
  },
  amount: {
    isNumeric: true,
    errorMessage: "La quantitat del producte no és correcta",
  },
};

module.exports = { shoppingCartSchema, shoppingCartProductSchema };
