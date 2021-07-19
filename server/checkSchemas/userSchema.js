const userSchema = {
  username: {
    isAlphanumeric: true,
    errorMessage: "El nom d'usuari ha de ser alfanumèric",
  },
  password: {
    isAlphanumeric: true,
    errorMessage: "La contrassenya ha de ser alfanumèrica",
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
  optional: {
    phone: {
      isMobilePhone: true,
      errorMessage: "Número de telèfon incorrecte",
    },
    address: {
      isAlpha: true,
      errorMessage: "Adreça incorrecta",
    },
  },
  email: {
    isEmail: true,
    errorMessage: "Correu electrònic incorrecte",
  },
};

module.exports = userSchema;
