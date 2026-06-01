/**
 * Konwencja kodów błędów: [Identyfikator Mikroserwisu][Typ HTTP][Specyficzny identyfikator]
 * Identyfikator Mikroserwisu: 1 (Auth Service)
 * Typ HTTP: 4 (błędy klienta np. 400, 401), 5 (błędy serwera np. 500)
 * Specyficzny identyfikator: 000 - 999
 */
const ApiErrors = Object.freeze({
    VALIDATION_ERROR: { status: 400, code: 14000, message: "Błąd walidacji danych wejściowych." },
    INVALID_CREDENTIALS: { status: 401, code: 14001, message: "Nieprawidłowy adres e-mail lub hasło." },
    EMAIL_ALREADY_IN_USE: { status: 400, code: 14002, message: "Podany adres e-mail jest już zajęty." },
    USER_NOT_FOUND: { status: 404, code: 14003, message: 'Nie znaleziono użytkownika.' },
    INVALID_OPERATION: { status: 400, code: 14004, message: 'Niedozwolona operacja.' },
    SERVER_ERROR: { status: 500, code: 15000, message: "Wewnętrzny błąd serwera." }
});

module.exports = { ApiErrors };
