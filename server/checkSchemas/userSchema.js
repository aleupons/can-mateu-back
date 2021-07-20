const userSchema = {
  username: {
    isAlphanumeric: true,
    errorMessage: "El nom d'usuari ha de ser alfanumèric",
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
    isAlpha: true,
    errorMessage: "El nom només pot contenir caràcters",
  },
  surnames: {
    isAlpha: true,
    errorMessage: "Els cognoms només poden contenir caràcters",
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
    isAlpha: true,
    errorMessage: "Adreça incorrecta",
  },
  isAdmin: {
    isBoolean: true,
    errorMessage: "S'ha d'indicar si l'usuari és administrador o no",
  },
};

module.exports = userSchema;
