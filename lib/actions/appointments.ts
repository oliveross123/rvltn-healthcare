"use server";

// import our genereated Prisma client
import prisma from "@/app/utils/db";

// model Appointment {
//     id                  String         @id @default(uuid())
//     patientFirstName    String
//     patientLastName     String
//     contactPhone        String
//     contactEmail        String
//     animalCategory      AnimalCategory
//     animalBreed         String
//     notes               String?
//     issueCategory       IssueCategory
//     appointmentDateTime DateTime
//     clinicId            String
//     clinic              User           @relation(fields: [clinicId], references: [id])
//     createdAt           DateTime       @default(now())
//     updatedAt           DateTime       @updatedAt
//   }

interface CreateAppointmentInput {
  patientFirstName: string;
  patientLastName: string;
  contactPhone: string;
  contactEmail: string;
  animalCategory: string;
  animalBreed: string;
  notes: string;
  issueCategory: string;
  appointmentDateTime: Date;
  clinicId: string;
}

export async function createAppointment(input: CreateAppointmentInput) {
  try {
    // create a new appointments in the db
    const newAppointment = await prisma.appointment.create({
      data: {
        patientFirstName: input.patientFirstName,
        patientLastName: input.patientLastName,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        animalCategory: input.animalCategory,
        animalBreed: input.animalBreed,
        notes: input.notes,
        issueCategory: input.issueCategory,
        appointmentDateTime: input.appointmentDateTime,
        clinicId: input.clinicId,
      },
    });

    return newAppointment;
  } catch (error) {
    console.error("Failed to create appointment", error);
    throw new Error("Failed to create appointment");
  }
}
