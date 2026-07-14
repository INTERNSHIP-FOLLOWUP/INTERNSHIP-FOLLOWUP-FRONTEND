# Company API Documentation

This document is for frontend developers who need to integrate with the company management APIs.

## Base URL

- http://127.0.0.1:8000/api

## Authentication

All company endpoints require authentication with Sanctum and an admin role.

### Headers

- Accept: application/json
- Authorization: Bearer {token}

### Login to get token

- Method: POST
- URL: /login

Request body:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

## Company Object

A company has the following fields:

```json
{
  "id": 1,
  "company_name": "ABC Tech",
  "address": "Phnom Penh",
  "industry": "Software",
  "contact_person": "John Doe",
  "phone": "012345678",
  "email": "info@abctech.com",
  "website": "https://abctech.com",
  "company_profile_image": null,
  "telegram_link": null,
  "created_at": "2026-07-11T12:00:00.000000Z",
  "updated_at": "2026-07-11T12:00:00.000000Z"
}
```

## Endpoints

### 1) List companies

- Method: GET
- URL: /admin/companies

Request headers:

```http
Accept: application/json
Authorization: Bearer {token}
```

Optional query parameters:

- search
- company_name
- industry
- per_page

Example request:

```http
GET /api/admin/companies?search=tech&per_page=10
```

Example response:

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "company_name": "ABC Tech",
      "address": "Phnom Penh",
      "industry": "Software",
      "contact_person": "John Doe",
      "phone": "012345678",
      "email": "info@abctech.com",
      "website": "https://abctech.com",
      "company_profile_image": null,
      "telegram_link": null,
      "created_at": "2026-07-11T12:00:00.000000Z",
      "updated_at": "2026-07-11T12:00:00.000000Z"
    }
  ],
  "per_page": 10,
  "total": 1
}
```

### 2) Create company

- Method: POST
- URL: /admin/companies

Request headers:

```http
Accept: application/json
Authorization: Bearer {token}
Content-Type: application/json
```

Request body:

```json
{
  "company_name": "ABC Tech",
  "address": "Phnom Penh",
  "industry": "Software",
  "contact_person": "John Doe",
  "phone": "012345678",
  "email": "info@abctech.com",
  "website": "https://abctech.com",
  "company_profile_image": "path/to/image.jpg",
  "telegram_link": "https://t.me/abctech"
}
```

Example response:

```json
{
  "id": 1,
  "company_name": "ABC Tech",
  "address": "Phnom Penh",
  "industry": "Software",
  "contact_person": "John Doe",
  "phone": "012345678",
  "email": "info@abctech.com",
  "website": "https://abctech.com",
  "company_profile_image": "path/to/image.jpg",
  "telegram_link": "https://t.me/abctech",
  "created_at": "2026-07-11T12:00:00.000000Z",
  "updated_at": "2026-07-11T12:00:00.000000Z"
}
```

Status: 201 Created

### 3) Show one company

- Method: GET
- URL: /admin/companies/{companyId}

Request headers:

```http
Accept: application/json
Authorization: Bearer {token}
```

Example request:

```http
GET /api/admin/companies/1
```

Example response:

```json
{
  "id": 1,
  "company_name": "ABC Tech",
  "address": "Phnom Penh",
  "industry": "Software",
  "contact_person": "John Doe",
  "phone": "012345678",
  "email": "info@abctech.com",
  "website": "https://abctech.com",
  "company_profile_image": null,
  "telegram_link": null,
  "created_at": "2026-07-11T12:00:00.000000Z",
  "updated_at": "2026-07-11T12:00:00.000000Z"
}
```

Status: 200 OK

### 4) Update company

- Method: PUT
- URL: /admin/companies/{companyId}

Request headers:

```http
Accept: application/json
Authorization: Bearer {token}
Content-Type: application/json
```

Request body:

```json
{
  "company_name": "ABC Tech Updated",
  "address": "Siem Reap",
  "industry": "IT Services",
  "contact_person": "Jane Doe",
  "phone": "099999999",
  "email": "contact@abctech.com",
  "website": "https://updated.abctech.com",
  "company_profile_image": "path/to/new-image.jpg",
  "telegram_link": "https://t.me/abctech"
}
```

Example response:

```json
{
  "company": {
    "id": 1,
    "company_name": "ABC Tech Updated",
    "address": "Siem Reap",
    "industry": "IT Services",
    "contact_person": "Jane Doe",
    "phone": "099999999",
    "email": "contact@abctech.com",
    "website": "https://updated.abctech.com",
    "company_profile_image": "path/to/new-image.jpg",
    "telegram_link": "https://t.me/abctech",
    "created_at": "2026-07-11T12:00:00.000000Z",
    "updated_at": "2026-07-11T12:00:00.000000Z"
  },
  "message": "Company updated successfully."
}
```

Status: 200 OK

### 5) Delete company

- Method: DELETE
- URL: /admin/companies/{companyId}

Request headers:

```http
Accept: application/json
Authorization: Bearer {token}
```

Example request:

```http
DELETE /api/admin/companies/1
```

Example response:

```json
{
  "message": "Company deleted successfully."
}
```

Status: 200 OK

## Validation Rules

When creating or updating a company:

- company_name is required and must be unique
- address is optional
- industry is optional
- contact_person is optional
- phone is optional
- email must be a valid email if provided
- website must be a valid URL if provided
- company_profile_image is optional
- telegram_link is optional

## Common Error Responses

- 401 Unauthorized → missing or invalid token
- 403 Forbidden → token is valid but user is not admin
- 404 Not Found → company ID does not exist
- 422 Unprocessable Entity → validation failed

## Frontend Integration Notes

- Save the created company ID from the create response and use it for update, show, and delete requests.
- Use the Bearer token from login for all protected requests.
- For list pages, use the pagination response returned by the backend.

## Example with Axios

```js
const token = localStorage.getItem('token');

const response = await axios.get('http://127.0.0.1:8000/api/admin/companies', {
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
```
