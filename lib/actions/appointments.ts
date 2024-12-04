"use server";

// import our genereated Prisma client
import prisma from "@/app/utils/db";

// model Appointment {
//   id                  String         @id @default(uuid())
//   patientFirstName    String
//   patientLastName     String
//   contactPhone        String
//   contactEmail        String
//   animalCategory      AnimalCategory
//   animalBreed         String
//   notes               String?
//   issueCategory       IssueCategory  @relation(fields: [issueCategoryId], references: [id])
//   appointmentDateTime DateTime
//   clinicId            String         @map("clinic_id")
//   createdAt           DateTime       @default(now())
//   updatedAt           DateTime       @updatedAt
//   User                User?          @relation(fields: [userId], references: [id])
//   userId              String?
//   issueCategoryId     String
// }

export interface CreateAppointmentInput {
  patientFirstName: string;
  patientLastName: string;
  contactPhone: string;
  contactEmail: string;
  animalCategory: "PES" | "KOCKA" | "JINE";
  animalBreed: string;
  notes?: string;
  issueCategory: string;
  appointmentDateTime: Date;
  clinicId: string;
}

export async function CreateAppointmentInput(input: CreateAppointmentInput) {
  try {
    // Vytvoření nového záznamu schůzky v databázi
    const newAppointment = await prisma.appointment.create({
      data: {
        patientFirstName: input.patientFirstName,
        patientLastName: input.patientLastName,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        animalCategory: input.animalCategory,
        animalBreed: input.animalBreed,
        notes: input.notes ?? null, // Nastavení na null, pokud je undefined
        issueCategory: {
          connect: { id: input.issueCategory },
        },
        appointmentDateTime: input.appointmentDateTime,
        clinicId: input.clinicId,
      },
    });

    console.log("Appointment created:", newAppointment);
    return newAppointment;
  } catch (error) {
    console.error("Failed to create appointment", error);
    throw new Error("Failed to create appointment");
  }
}
