# API Response Shapes

Every shape below mirrors a `src/types/*.ts` file exactly — this doc is a human-readable rendering of those types, not a separate source of truth. If the backend ever returns something different, the type file is what needs fixing, and this doc should follow.

## Envelope (all endpoints)

```json
// Success
{ "success": true, "message": "string", "data": { /* endpoint-specific */ } }

// Error
{ "success": false, "message": "string", "errorSources": [{ "path": "string", "message": "string" }] }
```

## Auth

**POST /auth/login → `data`**
```json
{ "accessToken": "string", "refreshToken": "string", "user": { /* User, see below */ } }
```

**POST /auth/register → `data`**
```json
{ /* User — assumed, not tokens. See API_INTEGRATION.md gap. */ }
```

**GET /auth/me → `data`**
```json
{ /* User */ }
```

## User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string | null",
  "address": "string | null",
  "profileImage": "string | null",
  "role": "CUSTOMER | TECHNICIAN | ADMIN",
  "status": "ACTIVE | BLOCKED",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```
`password` is never present in any frontend-facing type — the UI has no code path that could render it even if the backend sent it.

## Category
```json
{
  "id": "string",
  "name": "string",
  "description": "string | null",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## TechnicianProfile
```json
{
  "id": "string",
  "userId": "string",
  "bio": "string | null",
  "skills": ["string"],
  "experience": "number",
  "hourlyRate": "number",
  "location": "string",
  "averageRating": "number",
  "availability": [{ "date": "YYYY-MM-DD", "startTime": "HH:mm", "endTime": "HH:mm" }, "..."],
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "user": "User (when relation included)",
  "services": ["Service (when relation included)"]
}
```
`availability`'s inner shape is inferred from a Postman example payload, not schema-enforced (the field is a plain `Json?`).

## Service
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "technicianId": "string",
  "categoryId": "string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "technician": "TechnicianProfile (when relation included)",
  "category": "Category (when relation included)"
}
```

## Booking
```json
{
  "id": "string",
  "customerId": "string",
  "technicianId": "string",
  "serviceId": "string",
  "bookingDate": "ISO date string",
  "address": "string",
  "status": "REQUESTED | ACCEPTED | DECLINED | PAID | IN_PROGRESS | COMPLETED | CANCELLED",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "customer": "User (when relation included)",
  "technician": "TechnicianProfile (when relation included)",
  "service": "Service (when relation included)",
  "payment": "Payment | null (when relation included)"
}
```

## Payment
```json
{
  "id": "string",
  "transactionId": "string | null",
  "bookingId": "string",
  "amount": "number",
  "method": "string | null",
  "provider": "SSLCOMMERZ | STRIPE",
  "status": "PENDING | COMPLETED | FAILED | CANCELLED",
  "paidAt": "ISO date string | null",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

**POST /payments/init/:bookingId → `data`**
```json
{ "paymentUrl": "https://sandbox.sslcommerz.com/..." }
```

## Review
```json
{
  "id": "string",
  "customerId": "string",
  "technicianId": "string",
  "rating": "number (1-5)",
  "comment": "string | null",
  "createdAt": "ISO date string",
  "customer": "User (when relation included)",
  "technician": "TechnicianProfile (when relation included)"
}
```

## Admin dashboard stats

**GET /admin/dashboard → `data`**
```json
{
  "totalUsers": "number",
  "totalCustomers": "number",
  "totalTechnicians": "number",
  "totalBookings": "number",
  "totalPayments": "number",
  "totalRevenue": "number"
}
```
