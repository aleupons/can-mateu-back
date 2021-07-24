const userSchema = {
  username: {
    notEmpty: true,
    matches: {
      options: [/^[a-zA-Z0-9._]+$/],
    },
    errorMessage:
      "El nom d'usuari només pot contenir, lletres sense accents, números i els caràcters '.' i '_'",
  },
  password: {
    isLength: {
      options: {
        min: 6,
      },
      errorMessage: "La contrassenya ha de tenir mínim 6 caràcters",
    },
  },
  name: {
    notEmpty: true,
    matches: {
      options: [/^[A-Za-zÀ-ÖØ-öø-ÿ ]*$/],
    },
    errorMessage: "El nom només pot contenir lletres",
  },
  surnames: {
    notEmpty: true,
    matches: {
      options: [/^[A-Za-zÀ-ÖØ-öø-ÿ ]*$/],
    },
    errorMessage: "Els cognoms només poden contenir lletres",
  },
  phone: {
    optional: true,
    isNumeric: true,
    isLength: {
      options: {
        min: 9,
        max: 9,
      },
      errorMessage: "El número de telèfon ha de tenir 9 dígits",
    },
    errorMessage: "Número de telèfon incorrecte",
  },
  email: {
    isEmail: true,
    errorMessage: "Correu electrònic incorrecte",
  },
  address: {
    optional: true,
    matches: {
      options: [/^[A-Za-zÀ-ÖØ-öø-ÿ0-9./ ]*$/],
    },
    errorMessage: "Adreça incorrecta",
  },
  isAdmin: {
    optional: true,
    isBoolean: true,
    errorMessage: "S'ha d'indicar si l'usuari és administrador o no",
  },
};

module.exports = userSchema;
