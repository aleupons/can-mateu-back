const orderSchema = {
  userId: {
    isMongoId: true,
    errorMessage: "L'usuari no és correcte",
  },
  shoppingCartId: {
    isMongoId: true,
    errorMessage: "El carro de la compra no és correcte",
  },
  date: {
    isDate: true,
    errorMessage: "La data no és correcta (YYYY-mm-dd)",
  },
};

module.exports = orderSchema;
