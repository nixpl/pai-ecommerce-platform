/**
 * Konwencja kodów błędów: [Identyfikator Mikroserwisu][Typ HTTP][Specyficzny identyfikator]
 * Identyfikator Mikroserwisu: 4 (Order Service)
 * Typ HTTP: 4 (błędy klienta), 5 (błędy serwera)
 */
const ApiErrors = Object.freeze({
  VALIDATION_ERROR: { status: 400, code: 44000, message: 'Błąd walidacji danych wejściowych.' },
  CART_EMPTY: { status: 400, code: 44001, message: 'Koszyk jest pusty.' },
  CART_ITEM_NOT_FOUND: { status: 404, code: 44002, message: 'Nie znaleziono pozycji w koszyku.' },
  ORDER_NOT_FOUND: { status: 404, code: 44003, message: 'Nie znaleziono zamówienia.' },
  INVALID_ORDER_STATUS: { status: 400, code: 44004, message: 'Nieprawidłowy status zamówienia.' },
  ADDRESS_NOT_FOUND: { status: 404, code: 44005, message: 'Nie znaleziono adresu dostawy.' },
  INSUFFICIENT_STOCK: { status: 409, code: 44006, message: 'Produkt niedostępny w wymaganej ilości.' },
  EXTERNAL_SERVICE_ERROR: { status: 502, code: 44007, message: 'Błąd komunikacji z innym serwisem.' },
  SERVER_ERROR: { status: 500, code: 45000, message: 'Wewnętrzny błąd serwera.' }
});

module.exports = { ApiErrors };
