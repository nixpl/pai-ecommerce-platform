const SharedApiErrors = Object.freeze({
  MISSING_TOKEN: { status: 401, code: 94010, message: "Brak tokenu dostępu." },
  INVALID_TOKEN: { status: 401, code: 94011, message: "Token jest nieważny lub wygasł." },
  FORBIDDEN: { status: 403, code: 94030, message: "Brak uprawnień do tego zasobu." }
});

module.exports = { SharedApiErrors };