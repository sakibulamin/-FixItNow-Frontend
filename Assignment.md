# Assignment Requirements — Traceability

Maps every requirement from the original brief to where it's implemented. "Status" reflects actual code in the repo, not aspiration.

## Tech stack
| Requirement | Status | Where |
|---|---|---|
| Next.js 16, App Router | ✅ | whole project; `package.json` |
| TypeScript (strict) | ✅ | `tsconfig.json` (`strict: true`, `noUncheckedIndexedAccess: true`) |
| Tailwind CSS v4 | ✅ | `app/globals.css`, `postcss.config.mjs` |
| Shadcn UI | ✅ | `components/ui/*` |
| TanStack React Query | ✅ | every `features/*/hooks.ts` |
| Axios | ✅ | `lib/axios.ts`, `lib/api-client.ts` |
| React Hook Form + Zod | ✅ | every `features/*/schema.ts` + form component |
| Framer Motion | ✅ | `features/home/components/*`, services/technicians listing pages |
| Lucide React | ✅ | throughout |
| Sonner | ✅ | every mutation's `onSuccess`/`onError` |
| date-fns | ✅ | `lib/utils.ts` formatters, availability scheduler |
| Recharts | ✅ | technician earnings, admin overview |

## Authentication
| Requirement | Status | Where |
|---|---|---|
| Register / Login / Logout | ✅ | `features/auth`, `providers/auth-provider.tsx` |
| JWT stored, Bearer header attached | ✅ | `lib/axios.ts` request interceptor |
| Session persists across reloads | ✅ | cookie + `GET /auth/me` hydration on load |
| Role-based route protection | ✅ | `src/proxy.ts` (Next.js 16 convention) |
| Password never rendered | ✅ | `User` type has no `password` field at all |

## Public pages
| Requirement | Status | Where |
|---|---|---|
| Home: hero, categories, featured services/technicians, testimonials, CTA | ✅ | `app/(public)/page.tsx` + `features/home/components/*` |
| Services: search, filter, sort, pagination | ✅ | `app/(public)/services/*` |
| Service details | ✅ | `app/(public)/services/[serviceId]` |
| Technicians listing + details | ✅ | `app/(public)/technicians/*` |
| Booking request from technician details | ✅ | `features/bookings/components/booking-request-dialog.tsx` |

## Customer dashboard
| Requirement | Status | Where |
|---|---|---|
| Overview, booking history, booking details | ✅ | `app/(customer)/dashboard/*` |
| Status timeline, status badges | ✅ | `features/bookings/components/booking-status-timeline.tsx`, `components/shared/status-badge.tsx` |
| Payment history | ✅ (derived from `booking.payment`, no list endpoint exists) | `app/(customer)/dashboard/payments/page.tsx` |
| Pay Now / Cancel / Leave Review gated by status | ✅ | booking details page — see business-rule comments inline |
| Editable profile (name/phone/address only) | ✅ | `features/users/components/profile-form.tsx` |
| Settings (appearance + session) | ✅ | `app/(customer)/dashboard/settings/page.tsx` |

## Technician dashboard
| Requirement | Status | Where |
|---|---|---|
| Overview, upcoming jobs, booking requests | ✅ | `app/(technician)/technician/*` |
| Accept / Decline / Mark In Progress / Mark Completed | ✅ | `features/bookings/components/technician-booking-actions.tsx` — strictly matches valid enum transitions |
| Availability scheduler (calendar) | ✅ | `features/technicians/components/availability-scheduler.tsx` (react-day-picker) |
| Services CRUD (create/edit; no delete — unconfirmed) | ✅ | `features/services/components/service-form-dialog.tsx` |
| Reviews | ✅ | filtered client-side from `GET /reviews` |
| Earnings | ✅ (derived from bookings' nested payment, no earnings endpoint exists) | `app/(technician)/technician/earnings/page.tsx` |

## Admin dashboard
| Requirement | Status | Where |
|---|---|---|
| Overview + global statistics | ✅ | `GET /admin/dashboard` |
| User management: search, pagination, ban/unban | ✅ | `app/(admin)/admin/users/page.tsx` |
| Category CRUD | ✅ | `features/categories/*` |
| Bookings overview | ✅ | `GET /admin/bookings` |

## Payments
| Requirement | Status | Where |
|---|---|---|
| SSLCommerz redirect flow | ✅ | `PayNowButton` → `POST /payments/init/:bookingId` → `window.location.href` |
| Success / cancel pages | ✅ | `app/payment/success`, `app/payment/cancel` |
| No fake success, no invented webhook/verification endpoints | ✅ | success page only ever displays `GET /bookings/:id`'s real `payment.status`, polls rather than assumes |

## Cross-cutting
| Requirement | Status |
|---|---|
| Loading skeletons | ✅ per-feature skeleton components + route `loading.tsx` |
| Empty states | ✅ `components/shared/empty-state.tsx` used throughout |
| Error states + error boundaries | ✅ `components/shared/error-state.tsx` + route `error.tsx` files |
| `not-found.tsx` | ✅ root-level |
| Responsive, mobile-first | ✅ every page uses `sm:`/`lg:` breakpoints; admin tables collapse to cards below `sm` |
| Dark mode | ✅ `next-themes` + CSS variable tokens |
| Accessibility | ✅ Radix primitives (native focus/keyboard handling), `aria-label`s on icon-only buttons, semantic landmarks (`header`/`nav`/`main`) |

## Known, disclosed gaps (never silently worked around)
See `API_INTEGRATION.md` for the full list. Summary: no `/auth/refresh`, no `/auth/logout`, no password reset, no `/technicians/me`, no dedicated availability endpoint, no DELETE for services/technician profiles, no server-side pagination/search on `/services`, no `bookingId` on reviews, no payments-list endpoint, and the `GET /bookings` role-scoping and `POST /auth/register` response shape are both stated assumptions pending backend confirmation.
