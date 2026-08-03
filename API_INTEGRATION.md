# API Integration Reference

Base URL: `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:5000/api`)
Auth: `Authorization: Bearer <accessToken>`
Success envelope: `{ success: true, message, data }`
Error envelope: `{ success: false, message, errorSources: [] }`

This file tracks every backend endpoint actually called by the frontend, which feature module owns the call, and any assumption made where the Postman collection didn't fully specify behavior. Nothing below is invented — if an endpoint isn't listed here, the frontend doesn't call it.

## Auth — `src/features/auth`
| Method | Path | Used by |
|---|---|---|
| POST | `/auth/register` | Register form. Returns the created `User`, **not** tokens — no auto-login. |
| POST | `/auth/login` | Login form. Returns `{ accessToken, refreshToken, user }`. |
| GET | `/auth/me` | Session hydration on app load (`AuthProvider`). |

No `/auth/logout` or `/auth/refresh` endpoint exists — logout is client-side cookie clearing only; a 401 ends the session (no silent refresh).

## Users — `src/features/users`
| Method | Path | Used by |
|---|---|---|
| PATCH | `/users/:id` | Customer & technician Profile pages — restricted to `{ name, phone, address }` only. Never sends email/role/status/password. |

## Categories — `src/features/categories`
| Method | Path | Used by |
|---|---|---|
| GET | `/categories` | Public category browsing, service filters, admin category management. |

## Technicians — `src/features/technicians`
| Method | Path | Used by |
|---|---|---|
| GET | `/technicians` | Public listing, featured technicians, and `useMyTechnicianProfile()` (see below). |
| GET | `/technicians/:id` | Public technician details page. |
| POST | `/technicians` | Technician onboarding (create profile). |
| PATCH | `/technicians/:id` | Technician profile edits, and availability persistence (`availability` field). |

**No `/technicians/me` endpoint.** The logged-in technician's own profile is resolved by fetching the full `GET /technicians` list and matching `userId`. **No dedicated availability endpoint** — availability is stored via `PATCH /technicians/:id` since `availability` is a `Json?` field on the schema. **No DELETE endpoint** for technician profiles.

## Services — `src/features/services`
| Method | Path | Used by |
|---|---|---|
| GET | `/services?category=&location=&minPrice=&maxPrice=&rating=` | Public services listing. Only these 5 params are confirmed — no `page`/`limit`/`search`. |
| GET | `/services/:id` | Public service details page. |
| POST | `/services` | Technician "Add service". |
| PATCH | `/services/:id` | Technician "Edit service". |

**No DELETE endpoint** for services — technicians can create and edit, never delete, from this UI.

## Bookings — `src/features/bookings`
| Method | Path | Used by |
|---|---|---|
| POST | `/bookings` | Booking request dialog (customer). |
| GET | `/bookings` | Customer/technician/admin booking lists. **Assumed** to be scoped to the caller by role (JWT-based) — not confirmed by an explicit query param in the Postman collection. |
| GET | `/bookings/:id` | Booking details pages. |
| PUT | `/bookings/:id` | The single endpoint for every status transition: Accept, Decline, Cancel, Mark In Progress, Mark Completed — all send `{ status }`. |
| DELETE | `/bookings/:id` | "Remove from history" for DECLINED/CANCELLED bookings only. |

**Cancellation is only exposed for `REQUESTED`/`ACCEPTED`** (pre-payment) — cancelling a `PAID` booking is not exposed in the UI since the backend doesn't confirm support for it.

## Payments — `src/features/payments`
| Method | Path | Used by |
|---|---|---|
| POST | `/payments/init/:bookingId` | "Pay now" button — returns `{ paymentUrl }`, browser redirects there (`window.location.href`). Button disables itself through the redirect (not just the mutation's `isPending`) to prevent double-clicks re-initiating payment. |
| GET | `/payments/:id` | Booking details pages, called with `booking.payment.id` (a payment id, not a booking id). |

**No GET /payments list endpoint** — "Payment History" is derived by reading `booking.payment` off each of the customer's bookings, not a dedicated payments list call.

### Success/cancel redirect flow
`/payment/success` and `/payment/cancel` are frontend-only routes — there is **no backend webhook or payment-verification endpoint this frontend calls**; the backend confirms payment with SSLCommerz on its own and updates the `Payment` record. The frontend never marks a payment as successful on its own — it only ever displays what `GET /bookings/:id` (via the nested `payment` field) reports.

- The frontend reads an optional `?bookingId=` query param off the redirect URL. **This param name is not backend-confirmed** — SSLCommerz redirect URLs are configured server-side, and the Postman collection doesn't document what query params (if any) get appended. If `bookingId` is absent, the success/cancel pages show a generic status message rather than guessing at another param name.
- If `bookingId` is present, the success page polls `GET /bookings/:id` (every 3s, up to 10 attempts — see `features/payments/utils.ts`) while `booking.payment` is missing or `PENDING`, since SSLCommerz confirmation can land a moment after the redirect. It stops polling as soon as a terminal status (`COMPLETED`/`FAILED`/`CANCELLED`) is confirmed, and never displays "success" without a `COMPLETED` payment status from the backend.
- On confirmed success, the bookings list cache is invalidated so the dashboard/booking list reflect the new status immediately without a manual refresh.
- If payment settles as `FAILED`/`CANCELLED`, the page offers "Pay now" again (only if the booking is still `ACCEPTED`), reusing the same `PayNowButton`.

## Reviews — `src/features/reviews`
| Method | Path | Used by |
|---|---|---|
| GET | `/reviews` | Public testimonials, technician details reviews, technician's own reviews page — all filtered client-side by `technicianId` since there's no query param for it. |
| POST | `/reviews` | Review submission dialog — `{ customerId, technicianId, rating, comment }`. No `bookingId` field exists on this endpoint. |

## Admin — `src/features/admin`
| Method | Path | Used by |
|---|---|---|
| GET | `/admin/dashboard` | Admin overview stat cards — fields used verbatim: `totalUsers`, `totalCustomers`, `totalTechnicians`, `totalBookings`, `totalPayments`, `totalRevenue`. |
| GET | `/admin/users` | Admin user management table — search and pagination are client-side (no confirmed query params). |
| GET | `/admin/bookings` | Admin bookings table — same client-side search/filter/pagination approach. |
| PATCH | `/admin/users/:id` | Ban/Unban — sends `{ status: "ACTIVE" \| "BLOCKED" }`. Optimistically updates the cached users list, rolls back on error, invalidates on settle. |

Categories (full CRUD) live in `src/features/categories` and are shared with the public services filter:
| Method | Path | Used by |
|---|---|---|
| POST | `/categories` | Admin "Add category". |
| PATCH | `/categories/:id` | Admin "Edit category". |
| DELETE | `/categories/:id` | Admin "Delete category". |

## Route protection
Role-based route protection is implemented in `src/proxy.ts` (Next.js 16's `proxy.ts` convention, replacing `middleware.ts`). It reads the JWT/role cookies set at login and redirects unauthenticated or wrong-role requests — it doesn't call any backend endpoint itself.
