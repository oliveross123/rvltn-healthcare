import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";

export async function GET() {
  try {
    // Fetch recent appointments with status
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        date: "asc",
      },
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        date: true,
        clinicId: true,
        status: true, // Přidáno pole status
      },
    });

    // Count different statuses
    const scheduledCount = appointments.filter(
      (appointment) => appointment.status === "SCHEDULED"
    ).length;
    const pendingCount = appointments.filter(
      (appointment) => appointment.status === "PENDING"
    ).length;
    const cancelledCount = appointments.filter(
      (appointment) => appointment.status === "CANCELLED"
    ).length;

    return NextResponse.json({
      scheduledCount,
      pendingCount,
      cancelledCount,
      documents: appointments,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching appointments" },
      { status: 500 }
    );
  }
}
