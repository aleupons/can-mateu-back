const productSchema = {
  name: {
    matches: /^[a-zA-Z ]*$/,
    errorMessage: "El nom només pot contenir lletres",
  },
  description: {
    matches: /^[a-zA-Z ]*$/,
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
  discount: {
    optional: true,
    isNumeric: true,
    errorMessage: "El descompte només pot contenir números (% de descompte)",
  },
};

module.exports = productSchema;
