import type { BookingStatus } from "@/types/enums";
import type { User } from "@/types/user";
import type { TechnicianProfile } from "@/types/technician";
import type { Service } from "@/types/service";
import type { Payment } from "@/types/payment";


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


export interface CreateBookingPayload {
  customerId: string;
  technicianId: string;
  serviceId: string;
  bookingDate: string;
  address: string;
  amount: number;
}


export interface UpdateBookingStatusPayload {
  status: BookingStatus;
}
