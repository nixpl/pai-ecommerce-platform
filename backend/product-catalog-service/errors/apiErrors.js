const ApiErrors = Object.freeze({
    VALIDATION_ERROR: { status: 400, code: 34000, message: "Błąd walidacji danych wejściowych." },
    INVALID_OPERATION: { status: 400, code: 34001, message: "Niedozwolona operacja." },
    PRODUCT_NOT_FOUND: { status: 404, code: 34004, message: "Nie znaleziono produktu." },
    CATEGORY_NOT_FOUND: { status: 404, code: 34005, message: "Nie znaleziono kategorii." },
    VARIANT_NOT_FOUND: { status: 404, code: 34006, message: "Nie znaleziono wariantu." },
    SERVER_ERROR: { status: 500, code: 35000, message: "Wewnętrzny błąd serwera." }
});

module.exports = { ApiErrors };
