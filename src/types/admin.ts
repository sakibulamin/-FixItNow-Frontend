/**
 * Confirmed fields for GET /admin/dashboard, taken verbatim from the
 * "Dashboard" section of the API doc. No additional fields are assumed.
 */
export interface AdminDashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalTechnicians: number;
  totalBookings: number;
  totalPayments: number;
  totalRevenue: number;
}
