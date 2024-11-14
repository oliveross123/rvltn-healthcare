"use server";

import prisma from "@/app/utils/db";
import { reservationSchema } from "@/app/utils/zodSchemas";

interface CreateAppointmentInput {
  patientFirstName: string;
  patientLastName: string;
  contactPhone: string;
  contactEmail: string;
  animalCategory: "PES" | "KOCKA" | "JINE";
  animalBreed: string;
  notes?: string;
  issueCategory: "AKUTNI_PRIKLAD" | "STRIHANI_DRAPKU" | "KONTROLA" | "OCKOVANI";
  appointmentDateTime: Date | string;
  clinicId: string;
}

export async function createAppointment(input: CreateAppointmentInput) {
  try {
    // Validate the input data using Zod schema
    const validatedData = reservationSchema.parse({
      ...input,
      appointmentDateTime: new Date(input.appointmentDateTime), // Convert to Date object if needed
    });

    // Destructure the validated data for database insertion
    const {
      patientFirstName,
      patientLastName,
      contactPhone,
      contactEmail,
      animalCategory,
      animalBreed,
      notes,
      issueCategory,
      appointmentDateTime,
      clinicId,
    } = validatedData;

    // Ensure the clinic exists (optional step for verification)
    const clinic = await prisma.user.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      throw new Error("Clinic not found");
    }

    // Create a new appointment record
    const newAppointment = await prisma.appointment.create({
      data: {
        patientFirstName,
        patientLastName,
        contactPhone,
        contactEmail,
        animalCategory,
        animalBreed,
        notes: notes || null,
        issueCategory,
        appointmentDateTime:
          appointmentDateTime instanceof Date
            ? appointmentDateTime
            : new Date(appointmentDateTime),
        clinicId,
      },
    });

    // Return success response
    return { success: true, data: newAppointment };
  } catch (error) {
    // Handle and return error response
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
