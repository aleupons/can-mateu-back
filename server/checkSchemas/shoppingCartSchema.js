const shoppingCartSchema = {};

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

const shoppingCartProductRemoveSchema = {
  isBasket: {
    isBoolean: true,
    errorMessage: "S'ha d'indicar si s'està afegint un producte o una cistella",
  },
};

module.exports = {
  shoppingCartSchema,
  shoppingCartProductSchema,
  shoppingCartProductRemoveSchema,
};
