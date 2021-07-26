const basketSchema = {
  name: {
    notEmpty: true,
    matches: {
      options: [/^[A-Za-zÀ-ÖØ-öø-ÿ ]*$/],
    },
    errorMessage: "El nom només pot contenir lletres",
  },
  description: {
    notEmpty: true,
    matches: {
      options: [/^[A-Za-zÀ-ÖØ-öø-ÿ.,0-9/\-!?¿¡ ]*$/],
    },
    errorMessage: "La descripció només pot contenir lletres",
  },
  stock: {
    isNumeric: true,
    errorMessage: "Les unitats en stock han de ser un número",
  },
  priceUnit: {
    isNumeric: true,
    errorMessage: "El preu ha de ser un número",
  },
  unit: {
    isAlpha: true,
    errorMessage: "Les unitats només poden contenir lletres",
  },
  category: {
    isAlpha: true,
    errorMessage: "La categoria només pot contenir lletres",
  },
  size: {
    isAlpha: true,
    errorMessage: "La mida de la cistella només pot contenir lletres",
  },
  discount: {
    optional: true,
    isNumeric: true,
    errorMessage: "El descompte només pot contenir números (% de descompte)",
  },
};

const basketProductSchema = {
  _id: {
    optional: true,
    isMongoId: true,
    errorMessage: "L'id del producte no és correcta",
  },
  name: {
    options: [/^[A-Za-zÀ-ÖØ-öø-ÿ ]*$/],
    errorMessage: "El nom només pot contenir lletres",
  },
  description: {
    options: [/^[A-Za-zÀ-ÖØ-öø-ÿ.,0-9/\-!?¿¡ ]*$/],
    errorMessage: "La descripció només pot contenir lletres",
  },
  amount: {
    isNumeric: true,
    errorMessage: "La quantitat del producte no és correcta",
  },
  unit: {
    isAlpha: true,
    errorMessage: "Les unitats només poden contenir lletres",
  },
};

module.exports = { basketSchema, basketProductSchema };
