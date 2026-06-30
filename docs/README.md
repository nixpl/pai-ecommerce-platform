# Dokumentacja API — PAI E-Commerce Platform

Zbiorcza specyfikacja **OpenAPI 3.0** wszystkich mikroserwisów w jednym pliku `openapi.yaml`.

## Uruchomienie Swagger UI

```bash
cd docs
npm install
npm start
```

Otwórz w przeglądarce: **http://localhost:8080/api-docs**

Surowy plik specyfikacji: **http://localhost:8080/openapi.yaml**

## Zawartość specyfikacji

- **Auth Service** (`:3001`) — rejestracja, logowanie, role
- **Profile Service** (`:3002`) — profil i adresy dostawy
- **Catalog Service** (`:3003`) — produkty, kategorie, warianty
- **Order Service** (`:3004`) — koszyk i zamówienia

Każda operacja wskazuje właściwy serwer (`servers` na poziomie ścieżki).

## Testowanie w Swagger UI

1. Uruchom wszystkie mikroserwisy backendowe.
2. Wywołaj `POST /api/auth/login` na serwerze `:3001`.
3. Skopiuj token z odpowiedzi.
4. Kliknij **Authorize** i wklej: `Bearer <token>`.
5. Testuj chronione endpointy — pamiętaj o wyborze właściwego serwisu (port) przy każdej operacji.

## Błędy walidacji

Przy kodzie `VALIDATION_ERROR` odpowiedź zawiera tablicę `details`:

```json
{
  "error": {
    "code": 14000,
    "message": "Błąd walidacji danych wejściowych.",
    "details": [
      { "code": 1, "field": "email", "message": "Pole nie może być puste." }
    ]
  }
}
```

Kody szczegółów walidacji (`details[].code`):

| Kod | Znaczenie |
|-----|-----------|
| 1 | Puste pole |
| 2 | Nieprawidłowy format |
| 3 | Nieprawidłowa długość |
| 4 | Słabe hasło |

Pełna lista kodów błędów API opisana jest w sekcji `info.description` pliku OpenAPI.
