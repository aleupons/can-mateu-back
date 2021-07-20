const userSchema = {
  username: {
    matches: /^[a-zA-Z0-9]+$/,
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
    matches: /^[a-zA-Z ]*$/,
    errorMessage: "El nom només pot contenir caràcters",
  },
  surnames: {
    matches: /^[a-zA-Z ]*$/,
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
    matches: /^[a-zA-Z ]*$/,
    errorMessage: "Adreça incorrecta",
  },
  isAdmin: {
    isBoolean: true,
    errorMessage: "S'ha d'indicar si l'usuari és administrador o no",
  },
};

module.exports = userSchema;
