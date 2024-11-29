export type AppointmentStatus = "SCHEDULED" | "PENDING" | "CANCELLED";

export interface CreateAppointmentParams {
  clientName: string;
  clientEmail: string;
  date: Date;
  userId: string;
  primaryPhysician: string;
  status: AppointmentStatus;
  reason?: string;
  note?: string;
  cancellationReason?: string;
}

export interface UpdateAppointmentParams {
  appointmentId: string;
  userId: string;
  appointment: {
    date: Date;
    primaryPhysician: string;
    status: AppointmentStatus;
    reason?: string;
    note?: string;
    cancellationReason?: string;
  };
  type: "scheduled" | "cancelled" | "pending";
}
