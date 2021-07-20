const paymentSchema = {
  orderId: {
    isMongoId: true,
    errorMessage: "La comanda no és correcta",
  },
  bank: {
    isAlpha: true,
    errorMessage: "El banc només pot contenir lletres",
  },
  account: {
    isAlphanumeric: true,
    errorMessage: "El compte bancari ha de ser alfanumèric",
  },
};

module.exports = paymentSchema;
