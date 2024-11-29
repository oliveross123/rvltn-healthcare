import prisma from "@/app/utils/db";

export async function getAppointmentsByuserId(userId: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        doctor: {
          select: {
            id: true, // Získáme ID lékaře, abychom mohli nastavit primaryPhysicianId
          },
        },
      },
    });

    // Transformujeme appointments tak, aby všechny hodnoty odpovídaly očekávaným typům a formátu
    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment,
      primaryPhysicianId: appointment.doctor?.id || "",
      patientId: appointment.patientId || "", // Zajistíme, že patientId nebude null
    }));

    const scheduledCount = formattedAppointments.filter(
      (a) => a.status === "SCHEDULED"
    ).length;
    const pendingCount = formattedAppointments.filter(
      (a) => a.status === "PENDING"
    ).length;
    const cancelledCount = formattedAppointments.filter(
      (a) => a.status === "CANCELLED"
    ).length;

    return {
      documents: formattedAppointments,
      scheduledCount,
      pendingCount,
      cancelledCount,
    };
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return {
      documents: [],
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };
  }
}
