const shoppingCartSchema = {
  products: {
    optional: true,
    isArray: true,
    errorMessage: "Els productes no són correctes",
  },
  price: {
    optional: true,
    isNumeric: true,
    errorMessage: "El preu no és correcte",
  },
};

const shoppingCartProductSchema = {
  amount: {
    isNumeric: true,
    errorMessage: "La quantitat del producte no és correcta",
  },
  isBasket: {
    isBoolean: true,
    errorMessage: "S'ha d'indicar si s'està afegint un producte o una cistella",
  },
};

module.exports = { shoppingCartSchema, shoppingCartProductSchema };
