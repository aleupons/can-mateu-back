const commentSchema = {
  productId: {
    isMongoId: true,
    errorMessage: "El producte no és correcte",
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
    optional: true,
    isFloat: {
      options: {
        min: 0,
        max: 5,
      },
    },
    errorMessage: "La valoració ha de ser un número entre 0 i 5",
  },
};

module.exports = commentSchema;
