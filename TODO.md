# TODO

## Database Connection (Frontend ↔ Laravel API)

- [ ] Verify `VITE_API_URL` is configured in `.env` (default: `http://localhost:8000/api`).
- [ ] Confirm Laravel backend is running with MySQL 8 connection configured in `.env`.
- [ ] Test API connectivity using the `database` service health check (`/health` endpoint).
- [ ] Ensure CORS is configured in Laravel (`sanctum/csrf-cookie` or CORS middleware).
- [ ] Add connection status indicator in app layout.
- [ ] Run end-to-end test: Login → Fetch student list → Verify API/database response.

## Company CRUD wiring (CompanyListView + CompanyFormView + companyStore)

- [x] Confirmed companyStore implements create/read/update/delete via `/companies` endpoints.
- [x] Fixed navigation from Companies list to correct routes: `CompaniesCreate` and `CompaniesEdit`.
- [ ] Verify edit form loads and updates correctly against real API.
- [ ] Ensure companyStore response mapping matches backend list/get payloads.
- [ ] Run full end-to-end CRUD manual test (Create → Read → Update → Delete).

