"use server";

import prisma from "@/app/utils/db";

export async function getWorkingHoursBySiteId(siteId: string) {
  try {
    if (!siteId) {
      throw new Error("Site ID is required.");
    }

    const workingHours = await prisma.workingHours.findMany({
      where: { siteId },
      select: {
        dayOfWeek: true,
        openTime: true,
        closeTime: true,
      },
      orderBy: {
        dayOfWeek: "asc",
      },
    });

    return workingHours || []; // Vždy vrátí pole
  } catch (error) {
    console.error("Error fetching working hours:", error);
    return []; // Pokud dojde k chybě, vrátí prázdné pole
  }
}
