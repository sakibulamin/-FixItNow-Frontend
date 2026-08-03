import type { BookingStatus } from "@/types/enums";
import type { User } from "@/types/user";
import type { TechnicianProfile } from "@/types/technician";
import type { Service } from "@/types/service";
import type { Payment } from "@/types/payment";

/**
 * Mirrors Booking in booking.prisma. Per the API doc, a booking "contains
 * Customer, Technician, Service, Payment" when fetched — those relations
 * are optional here since list endpoints may or may not include them.
 */
export interface Booking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  bookingDate: string;
  address: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  technician?: TechnicianProfile;
  service?: Service;
  payment?: Payment | null;
}

/** Confirmed request body for POST /bookings (from the Postman example). */
export interface CreateBookingPayload {
  customerId: string;
  technicianId: string;
  serviceId: string;
  bookingDate: string;
  address: string;
  amount: number;
}

/** Confirmed request body for PUT /bookings/:id — status transitions only. */
export interface UpdateBookingStatusPayload {
  status: BookingStatus;
}
