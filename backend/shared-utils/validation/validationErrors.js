/**
 * Zbiór szczegółowych kodów błędów walidacji używanych przy wprowadzaniu danych.
 * Format w odpowiedzi JSON:
 * "details": [{ "code": 1, "field": "email", "message": "Pole nie może być puste." }]
 */
const ValidationErrors = Object.freeze({
    EMPTY_FIELD: { code: 1, message: "Pole nie może być puste." },
    INVALID_FORMAT: { code: 2, message: "Oczekiwany format: {{format}}." },
    INVALID_LENGTH: { code: 3, message: "Długość pola musi wynosić od {{min}} do {{max}} znaków." },
    WEAK_PASSWORD: { code: 4, message: "Hasło jest zbyt słabe. Wymagane: {{requirements}}." }
});

module.exports = { ValidationErrors };