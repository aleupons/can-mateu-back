const commentSchema = {
  productId: {
    isMongoId: true,
    errorMessage: "El producte no és correcte",
  },
  userId: {
    isMongoId: true,
    errorMessage: "L'usuari no és correcte",
  },
  comment: {
    isLength: {
      options: {
        max: 150,
      },
    },
    errorMessage: "El comentari ha de tenir màxim 150 paraules",
  },
  rating: {
    isFloat: {
      options: {
        min: 0,
        max: 5,
      },
    },
    errorMessage: "La valoració ha de ser un número entre 0 i 5",
  },
  date: {
    isDate: true,
    errorMessage: "La data no és correcta (YYYY-mm-dd)",
  },
};

module.exports = commentSchema;
