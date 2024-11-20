import prisma from "../../../app/utils/db"; // Ujistěte se, že cesta k prisma klientovi je správná

export type CreateAppointmentInput = {
  patientFirstName: string;
  patientLastName: string;
  contactPhone: string;
  contactEmail: string;
  animalCategory: "PES" | "KOCKA" | "JINE";
  animalBreed: string;
  notes?: string;
  issueCategory: "AKUTNI_PRIKLAD" | "STRIHANI_DRAPKU" | "KONTROLA" | "OCKOVANI";
  appointmentDateTime: Date;
  clinicId: string;
};

export async function createAppointment(data: CreateAppointmentInput) {
  if (!data) {
    throw new Error("Appointment data is required.");
  }

  try {
    // Vytvoření schůzky pomocí Prisma
    const appointment = await prisma.appointment.create({
      data: {
        patientFirstName: data.patientFirstName,
        patientLastName: data.patientLastName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        animalCategory: data.animalCategory,
        animalBreed: data.animalBreed,
        notes: data.notes,
        issueCategory: data.issueCategory,
        appointmentDateTime: data.appointmentDateTime,
        clinicId: data.clinicId,
      },
    });

    console.log("Appointment successfully created:", appointment);
    return appointment;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error("Failed to create appointment.");
  }
}
