const basketSchema = {
  photoUrl: {
    errorMessage: "La url de la foto només pot contenir lletres",
  },
  name: {
    matches: /^[a-zA-Z ]*$/,
    errorMessage: "El nom només pot contenir lletres",
  },
  description: {
    matches: /^[a-zA-Z ]*$/,
    errorMessage: "La descripció només pot contenir lletres",
  },
  basketProducts: {
    isArray: true,
    errorMessage: "Els productes no són correctes",
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
  date: {
    isDate: true,
    errorMessage: "La data no és correcta (YYYY-mm-dd)",
  },
};

const basketProductSchema = {
  _id: {
    optional: true,
    isMongoId: true,
    errorMessage: "L'id del producte no és correcta",
  },
  name: {
    matches: /^[a-zA-Z ]*$/,
    errorMessage: "El nom només pot contenir lletres",
  },
  description: {
    matches: /^[a-zA-Z ]*$/,
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
