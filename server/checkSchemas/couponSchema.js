const couponSchema = {
  code: {
    isAlphanumeric: true,
    errorMessage: "El codi ha de ser alfanumèric",
  },
};

module.exports = couponSchema;
