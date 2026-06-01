/**
 * Konwencja kodów błędów: [Identyfikator Mikroserwisu][Typ HTTP][Specyficzny identyfikator]
 * Identyfikator Mikroserwisu: 2 (Profile Service)
 * Typ HTTP: 4 (błędy klienta np. 400, 401, 404, 409), 5 (błędy serwera np. 500)
 * Specyficzny identyfikator: 000 - 999
 */
const ApiErrors = Object.freeze({
    VALIDATION_ERROR: { status: 400, code: 24000, message: "Błąd walidacji danych wejściowych." },
    PROFILE_NOT_FOUND: { status: 404, code: 24004, message: "Nie znaleziono profilu." },
    PROFILE_ALREADY_EXISTS: { status: 409, code: 24009, message: "Profil już istnieje." },
    ADDRESS_NOT_FOUND: { status: 404, code: 24005, message: "Nie znaleziono adresu." },
    SERVER_ERROR: { status: 500, code: 25000, message: "Wewnętrzny błąd serwera." }
});

module.exports = { ApiErrors };
