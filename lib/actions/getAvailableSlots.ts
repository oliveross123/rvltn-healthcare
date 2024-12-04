import prisma from "@/app/utils/db";

export async function getAvailableSlots(siteId: string) {
  try {
    const workingHours = await prisma.workingHours.findMany({
      where: { siteId },
    });

    const appointments = await prisma.appointment.findMany({
      where: { clinicId: siteId },
      select: { appointmentDateTime: true },
    });

    // Získání již obsazených termínů
    const bookedSlots = appointments.map(
      (appt) => new Date(appt.appointmentDateTime)
    );

    const slots: { start: string; end: string }[] = [];

    workingHours.forEach((hours) => {
      const { dayOfWeek, openTime, closeTime } = hours;

      // Iterace přes další týdny (pro ukázku pouze jeden týden)
      const today = new Date();
      const daysAhead = (dayOfWeek - today.getDay() + 7) % 7;
      const workDate = new Date(today);
      workDate.setDate(today.getDate() + daysAhead);

      const [openHour, openMinute] = openTime.split(":").map(Number);
      const [closeHour, closeMinute] = closeTime.split(":").map(Number);

      // Nastavení časů na pracovní dny
      const startTime = new Date(workDate);
      const endTime = new Date(workDate);
      startTime.setHours(openHour, openMinute, 0, 0);
      endTime.setHours(closeHour, closeMinute, 0, 0);

      // Generování 30min slotů mezi otevřením a zavřením
      let currentTime = new Date(startTime);
      while (currentTime < endTime) {
        const nextSlot = new Date(currentTime);
        nextSlot.setMinutes(currentTime.getMinutes() + 30);

        const isBooked = bookedSlots.some(
          (booked) => booked.getTime() === currentTime.getTime()
        );

        if (!isBooked) {
          slots.push({
            start: currentTime.toISOString(),
            end: nextSlot.toISOString(),
          });
        }

        currentTime = nextSlot;
      }
    });

    return slots;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return [];
  }
}
