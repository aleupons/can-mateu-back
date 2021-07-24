const shoppingCartSchema = {};

const shoppingCartProductSchema = {
  amount: {
    isNumeric: true,
    errorMessage: "S'ha d'indicar una quantitat del producte numèrica",
  },
  isBasket: {
    isBoolean: true,
    errorMessage: "S'ha d'indicar si s'està afegint un producte o una cistella",
  },
};

const shoppingCartProductRemoveSchema = {
  isBasket: {
    isBoolean: true,
    errorMessage:
      "S'ha d'indicar si s'està eliminant un producte o una cistella",
  },
};

module.exports = {
  shoppingCartSchema,
  shoppingCartProductSchema,
  shoppingCartProductRemoveSchema,
};
